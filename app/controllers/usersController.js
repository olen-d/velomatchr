const Sequelize = require("sequelize");

// Models
const { MatchPref, User } = require("../models");

// Packages
const jwt = require("jsonwebtoken");

// Helpers
// const auth = require("../helpers/auth-module");
const bcrypt = require("../helpers/bcrypt-module");
const reverseGeocode = require("../helpers/reverse-geocode");

exports.create_user = (req, res) => {
  const { email, password, latitude, longitude } = req.body;

  reverseGeocode.reverseGeocode(latitude, longitude).then(locationRes => {
    locationRes.json().then(locationRes => {
      const location = locationRes.results[0].locations[0];
      const { adminArea1: countryCode = "BLANK", adminArea3: stateCode = "BLANK", adminArea5: city = "BLANK"} = location;

      bcrypt.newPass(password).then(pwdRes => {
        if(pwdRes.status === 200) {
          const emailParts = email.split("@");
          const name = emailParts[0];
  
          User.create({
            name,
            password: pwdRes.passwordHash,
            email,
            latitude,
            longitude,
            city,
            state: "blank",
            stateCode,
            country: "blank",
            countryCode
          }).then(user => {
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
          }).catch(err => {
            console.log("usersController.js ERROR:\n",err);
            res.status(500).json({ error: err });
          });
        } else {
          res.status(500).json({ error: "userController ~53" });
        }
      });
    })
  })
  .catch(err => {
    // TODO: do something with the error
    console.log("ERROR - usersController.js ~ 60", err);
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

exports.update_profile_required = (req, res) => {
  const { userId: id, fullName, gender } = req.body;
  const [ firstName, ...remainingNames ] = fullName.split(" ");
  const lastName = remainingNames.join(" ");
  console.log("\n" + id, firstName, lastName, gender);
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
};
