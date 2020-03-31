const fetch = require("node-fetch");
const Sequelize = require("sequelize");

// Models
const { EmailVerification, MatchPref, User } = require("../models");

// Packages
const jwt = require("jsonwebtoken");

// Helpers
// const auth = require("../helpers/auth-module");
const adr = require ("../helpers/arbitrary-digit-random");
const bcrypt = require("../helpers/bcrypt-module");
const passwordUpdatedEmail = require("../helpers/password-updated-email");
const passwordValidate = require("../helpers/password-validate");
const reverseGeocode = require("../helpers/reverse-geocode");

// Create and Create/Update Modules
exports.create_user = (req, res) => {
  const { email, password, latitude, longitude } = req.body;
  const errors = [];

  reverseGeocode.reverseGeocode(latitude, longitude).then(locationRes => {
    locationRes.json().then(locationRes => {
      const location = locationRes.results[0].locations[0];
      const { adminArea1: countryCode = "BLANK", adminArea3: stateCode = "BLANK", adminArea5: city = "BLANK", postalCode = "000000"} = location;

      // TODO: At some point fix this and the front end to flag all applicable errors rather than just bailing if the email is invalid
      checkEmail(email)
        .then(result => {
          if (!result) {
            errors.push({ error: "IVE", message: "Invalid Email Address", status: 500 });
            res.json({ errors })
          } 
        })
        .catch(error => {
          errors.push({ error: "IVE", message: "Invalid Email Address", extra: error, status: 500 });
          res.json({ errors })
        });

      passwordValidate.validatePassword(password).then(isValid => {
        if (isValid) {
          bcrypt.newPass(password).then(pwdRes => {
            if(pwdRes.status === 200) {
              const emailParts = email.split("@");
              const name = emailParts[0];
      
              User.create({
                name,
                password: pwdRes.passwordHash,
                email,
                emailIsVerified: 0,
                latitude,
                longitude,
                city,
                state: "blank",
                stateCode,
                country: "blank",
                countryCode,
                postalCode
              }).then(user => {
                const formData = {
                  email,
                  userId: user.id
                }
                fetch(`${process.env.REACT_APP_API_URL}/api/users/email/send/verification`, {
                  method: "post",
                  headers: {
                    "Content-Type": "application/json"
                  },
                    body: JSON.stringify(formData)
                  }).then(response => {
                    if (!response.error) {
                      jwt.sign(
                        {user: user.id},
                        process.env.SECRET,
                        { expiresIn: "1h" },
                        (err, token) => {
                          return res.status(200).json({
                            authenticated: true,
                            token
                          });
                        });
                    } else {
                      console.log("\n\nusersController.js ~85 ERROR:", response);
                      // TODO, parse response.error and provide a more useful error message
                    }
                  }).catch(error => {
                    return ({
                      type: "error",
                      message: "Internal server error.",
                      error: error
                    })
                  });
                }).catch(error => {
                  // Database error
                  res.json({ error });
                });
              } else {
                res.status(500).json({ error: "userController ~100" });
              }
            })
            .catch(error => {
              res.json({ error })
            });
        } else {
          errors.push({ error: "IVP", message: "Invalid Password", status: 500 });
          res.json({ errors });
        }
      })
      .catch(error => {
        errors.push({ error, message: "Invalid Password", status: 500 });
        res.json({ errors });
      });
    })
    .catch(err => {
      // TODO: do something with the error
      console.log("ERROR - usersController.js ~ 135", err);
    });
  })
  .catch(error => {
    res.json({ error });
  });
};

// Read Modules
exports.read_one_email_verification = (req, res) => {
  const { userId, verificationCode } = req.body;

  EmailVerification.findOne({
    where: {
      userId
    },
    attributes: ["attempts"]
  })
  .then(data => {
    if (data.attempts < 3) {
      EmailVerification.findOne({
        where: {
          userId,
          verificationCode
        },
        attributes: { exclude: ["verificationCode"]}
      })
      .then(data => {
        // Check to make sure the code hasn't expired
        const expiration = new Date(Date.now() - (24 * 60 * 60 * 1000));
        const createdAt = new Date(data.createdAt);
        if (createdAt < expiration) {
          // TODO: Delete the record
          res.status(410).json({ error: "Gone", code: "910", message: "The verification code has expired. "});
        } else {
          // Verification was successful, delete the record
          fetch(`${process.env.REACT_APP_API_URL}/api/users/verification/codes/${userId}`, {
            method: "delete"
          })
          .then(response => {
            if(!response.ok) {
              throw new Error ("Network response was not ok.");
            }
          })
          .catch(error => {
            res.json({ error, code: "900", message: "Verification code not deleted" });
          });
          res.json({ data });
        }
      })
      .catch(error => {
        if (userId) {
          EmailVerification.increment(
            "attempts",
            { where: { userId }}
          )
          .then(data => {
            res.status(403).json({ error: "Code Not Found", code: "903", message: "Verification code did not match." });
          })
          .catch(error => {
            res.status(400).json({ error, code: "900", message: "Verification attempts not updated." });
          });
        } else {
          res.status(403).json({ error: "Code Not Found", code: "903", message: "Verification code did not match." });
        }
      });
    } else {
      res.status(429).json({ error: "Too Many Requests", code: "929", message: "The number of attempts to verify the email address have exceeded the limit. " });
    }
  })
  .catch(error => {
    res.status(404).json({ error, code: "904", message: "No verification code was found. " });
  });
};

exports.read_one_user = (req, res) => {
  const userName = req.params.username;

  User.findOne({
    where: {
      name: userName
    },
    attributes: { exclude: ["password"]}
  })
  .then(resolve => {
    let userObj = {
      user: resolve
    };
    res.send(userObj);
  })
  .catch(err => {
    res.json(err);
  });
};

exports.read_one_user_id_by_email = (req, res) => {
  // Note: this does not require authentication
  // Intended to be used with the reset password function

  const email = req.params.email;

  User.findOne({
    where: {
      email
    },
    attributes: ["id", "password", "firstName", "lastName", "createdAt"]
  })
  .then(data => {
    if(!data) {
      res.json({ error: "No user was found."});
    } else {
      res.json({ data });
    }
  })
  .catch(error => {
    res.json({ error });
  });
};

exports.read_one_user_by_id = (req, res) => {
  const userId = req.params.userId;

  User.findOne({
    where: {
      id: userId
    },
    attributes: { exclude: ["password"]}
  })
  .then(resolve => {
    let userObj = {
      user: resolve
    };
    res.send(userObj);
  })
  .catch(err => {
    res.json(err);
  });
};

exports.read_one_user_by_id_reset = (req, res) => {
  const { id, token } = req.params;
  User.findOne({
    where: {
      id
    },
    attributes: ["password", "createdAt"]
  })
  .then(data => {
    const { password, createdAt } = data;
    const created = new Date(createdAt);
    const secret = password + created.getTime();

    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        res.json({ error })
      } else {
        res.json({ decoded });
      }
    });
  })
};

// Get the user's information and match preferences
exports.read_one_user_and_matches_preferences = (req, res) => {
  const userId = req.params.userId;

  User.findOne({
    where: {
      id: userId
    },
    attributes: {
      include: [
        [Sequelize.literal("latitude - (15.0 / 69.0)"), "latMinus"],
        [Sequelize.literal("latitude + (15.0 / 69.0)"), "latPlus"],
        [Sequelize.literal("longitude - (15.0 / (69.0 * COS(RADIANS(latitude))))"), "longMinus"],
        [Sequelize.literal("longitude + (15.0 / (69.0 * COS(RADIANS(latitude))))"), "longPlus"]
      ],
      exclude: ["password"]
    },
    include: [{
      model: MatchPref,
      as: "userMatchPrefs",
      attributes: ["distance", "gender"]
    }]
  })
  .then(resolve =>{
    let userObj = {
      user: resolve
    };
    res.send(userObj);
  })
  .catch(err => {
    res.json(err);
  });
};

exports.read_login = (req, response) => {
  const { username, pass } = req.body;

  User.findOne({
    where: {
      email: username
    }
  })
  .then(user => {
    if (user != null) {
      bcrypt
        .checkPass(pass, user.password)
        .then(res => {
          if (res.status === 200 && res.login) {
            jwt.sign(
              {user: user.id},
              process.env.SECRET,
              { expiresIn: "1h" },
              (err, token) => {
                return response.status(200).json({
                  authenticated: true,
                  token
                });
              }
            );
          } else {
            return response.status(500).json({
              authenticated: false
            });
          }
        })
        .catch(error => {
          response.json(error);
        });
    } else {
      return response.status(404).json({
        authenticated: false
      });
    }
  });
};

// Update modules
exports.update_is_email_verified = (req, res) => {
  const { id, isEmailVerified } = req.body;

  User.update(
    { isEmailVerified: isEmailVerified },
    { where: { id }}
  )
  .then(data => {
    res.status(200).json(data);
  })
  .catch(error => {
    res.status(500).json({ error });
  })
};

exports.update_user_password = (req, res) => {
  const { password: newPassword, token, userId: id, } = req.body;
  const errors = [];

  User.findOne({
    where: {
      id
    },
    attributes: [ "createdAt", "email", "firstName", "lastName", "password"]
  })
  .then(data => {
    const { createdAt, email, firstName, lastName, password } = data;
    const created = new Date(createdAt);
    const secret = password + created.getTime();

    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        res.json({ error });
      } else if (decoded) {
        passwordValidate.validatePassword(newPassword).then(isValid => {
          if (isValid) {
            bcrypt.newPass(newPassword).then(pwdRes => {
              if(pwdRes.status === 200) {    
                User.update(
                  { password: pwdRes.passwordHash },
                  { where: {id }}
                ).then(data => {
                  if (data[0] === 1) {
                    // Send password has been reset email
                    // TODO: fix this so it doesn't crash if the passwordUpdatedEmail craps out
                    // TODO: log somewhere if the email fails...
                    passwordUpdatedEmail.send(email, firstName, lastName);
                  }
                  res.json({ data });
                })
                .catch(error => {
                  // TODO - return some sort of useful error
                  res.json({ error });
                });
              } else {
                // TODO: Throw useful error. 
                // Unable to hash password.
              }
            });
          } else {
            // Invalid Password
            errors.push({ error: "IVP", message: "Invalid Password", status: 500 });
            res.json({ errors });
          }
        }).catch(error => {
          // TODO - return some sort of useful error
          res.json({ error });
        });
      }
    });
  })
  .catch(error => {
    // TODOL Throw useful error.
    // Couldn't find users
  });
};

exports.update_profile_required = (req, res) => {
  const { userId: id, fullName, gender } = req.body;
  const [ firstName, ...remainingNames ] = fullName.split(" ");
  const lastName = remainingNames.join(" ");
  const errors = [];

  const checkName = (firstName, lastName) => {
    if(firstName.length < 1 || lastName.length < 1) {
      errors.push({error: "IVN", message: "Invalid First or Last Name", status: 500});
      return false;
    }
    return true;
  };

  const checkGender = gender => {
    if (gender === "default") {
      errors.push({error: "IVG", message: "Invalid Gender", status: 500});
      return false;
    }
    return true;
  };

  const isValidName = checkName(firstName, lastName);
  const isValidGender = checkGender(gender);

  if (isValidName && isValidGender) {
    User.update(
      { firstName, lastName, gender },
      { where: { id }}
    )
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).json({error: err});
    })
  } else {
    res.json({ errors });
  }
};

// Delete requests

exports.delete_user_email_verification_codes = (req, res) => {
  const { userId } = req.params

  EmailVerification.destroy({
    where: { userId }
  })
  .then(response => {
    if (response !== 1) {
      res.json({ error: "notdeleted"});
    } else {
      res.json({ data: "The previous email verification codes were deleted successfully."});
    }
  })
  .catch(error => {
    res.json({ error });
  })
}

//
// Non-CRUD Business Logic
//

// Send Email Verification Code
exports.send_email_verification_code = (req, res) => {
  const { email, userId } = req.body;

  const newCode = adr.newRandomCode(6);

  // Add the new code and userId to the database
  EmailVerification.create({
    userId,
    verificationCode: newCode,
    attempts: 0
  })
  .then(data => {
    // TODO -figure out what to do here
  })
  .catch(error => {
    // TODO - return some sort of useful error
  });
  // TODO - if the code isn't unique, generate a new one
  // TODO - if nothing was entered in the database, stop and return an error, don't send a bogus confirmation email
  const formData = {
    fromAddress: "\"VeloMatchr Email Confirmation\" <confirm@velomatchr.com>", 
    toAddress: email, 
    subject: "Confirm Your Email Address", 
    message: `<p>Almost there! Please confirm your email address by entering the following code: <b>${newCode}</b></p>`
  }
  fetch(`${process.env.REACT_APP_API_URL}/api/mail/send`, {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (!response.error) {
      res.json(response);
    }
  })
  .catch(error => {
    res.json(error)
  });
}

// Password Reset

exports.reset_user_password = (req, res) => {
  const { email } = req.body;
  // Check that the email exists
  fetch(`${process.env.REACT_APP_API_URL}/api/users/email/${email}`).then(data => {
    data.json().then(json =>{
      if (json.error) {
        res.json({ error: json.error })
      } else {
        const {id, password, firstName, lastName, createdAt } = json.data;
        const payload = {
          id,
          email
        };
        const created = new Date(createdAt);
        const secret = password + created.getTime();

        const tempToken = jwt.sign(
          {payload},
          secret,
          { expiresIn: "1h" },
        );

        // Create the password reset link
        const passwordResetLink = `${process.env.REACT_APP_URL}/login/reset-password/${id}/${tempToken}`;
        // Create the email
        const formData = {
          fromAddress: "\"VeloMatchr Password Reset\" <reset@velomatchr.com>", 
          toAddress: email, 
          subject: "Reset Your Password", 
          message: `<p>Hi ${firstName} ${lastName},</p><p>We received a request to reset your VeloMatchr password. If it wasn't you, don't worry, your password is safe and you can ignore this email. </p><p>To reset your password use the following link: <a href=${passwordResetLink}>Reset My Password</a>. </p><p>The password reset link will expire in one hour. </p>`
        }
        // Send the email
        fetch(`${process.env.REACT_APP_API_URL}/api/mail/send`, {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
            body: JSON.stringify(formData)
          }).then(data => {
            return data.json();
          }).then(json => {
            if (!json.error) {
              res.json({ data: json });
            }
          }).catch(error => {
            res.json({ error });
          });
        }
      })
      .catch(error => {
        res.json({ error });
      });
    })
    .catch(error => {
      res.json({ error });
    });
};

// Check for MX record

const checkEmail = async email => {
  const expression = /.+@.+\..+/i;
  if(expression.test(String(email).toLowerCase())) {
    const result = await fetch(`${process.env.REACT_APP_API_URL}/api/mail/check-mx/${email}`);
    const data = await result.json();
    const { mxExists } = data;

    return mxExists ? true : false;
  }
};
