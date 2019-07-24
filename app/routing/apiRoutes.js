module.exports = (app) => {

  const multer = require("multer");
  const jwt = require("jsonwebtoken");
  const config = require("./../../config")

  const bcrypt = require("./../helpers/bcrypt-module");

  const db = require("./../models");

  // Set Storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images-profiles")
    }, // TODO - FIX THIS TO FILTER FOR IMAGE FILES
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + "-" + file.originalname)
    }
  })
   
  const upload = multer({ storage: storage })

  app.post("/api/signup", upload.single("profilePhotographFile"), (req, res) => {
    if (!req.file) {
      return res.send({
        success: false,
        errorCode: 404,
        errorMsg: "No file was uploaded"
      });

    } else {
      const formData = req.body;

      bcrypt.newPass(formData.password).then(pwdRes => {
      if(pwdRes.status === 200) {
        db.User.create({
          name: formData.firstName + "." + formData.lastName.slice(0,1),
          password: pwdRes.passwordHash,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.emailAddress,
          phone: formData.telephoneNumber,
          photoLink: req.file.path,
          gender: formData.gender,
          latitude: formData.latitude,
          longitude: formData.longitude,
          city: "blank",
          state: "blank",
          stateCode: "blank",
          country: "blank",
          countryCode: "bla"
        }).then(user => {
          // res.json(newUser);
          jwt.sign({ userId: user.id }, config.secret, { expiresIn: "24h" }, (err, token) => {
            return res
              .status(200)
              .json({ 
                token,
                authenticated: true
              })
              // .redirect("/"); // Since this project is using React, the redirect will be handled on the client side
          });
          // return res.send({
          //   success: true,
          //   login: true,
          //   userId: newUser.id,
          // });
        });
        } else {
          return res.send({
            errorCode: 500,
            errorMsg: "Internal Server Error"
          });
        }
      });
    }
  });

  app.post("/api/survey/submit", (req, res) => {
    const formData = req.body;
    const userId = formData.userId;

    delete formData.userId;

    const answers = Object.values(formData);

    db.Answer.create({
      userId: userId,
      answers: answers.join()
    }).then(newAnswer => {
      return res.json(newAnswer);
    }).catch(error => {
      res.send({
        errorCode: 500,
        errorMsg: "Internal Server Error",
        errorDetail: error
      })
    });
  });

  app.post("/api/matches/preferences/submit", (req, res) => {
    const formData = req.body;

    db.MatchPreference.create({
      userId: formData.userId,
      distance: formData.distance,
      gender: formData.gender
    }).then(newMatchPreferences => {
      return res.json(newMatchPreferences);
    }).catch(error => {
      res.send({
        errorCode: 500,
        errorMsg: "Internal Server Error",
        errorDetail: error
      })
    });
  });

  app.post("/api/login/submit", (req, res) => {
    const formData = req.body;

    db.User.findOne({
      where: {
        email: formData.user
      }
    }).then(user => {
      bcrypt
        .checkPass(formData.pass, user.password)
        .then(response => {
          if (response.status === 200 && response.login === true) {
            jwt.sign({ user: user.id }, config.secret, { expiresIn: "24h" }, (err, token) => {
              return res
                .status(200)
                .json({ 
                  token,
                  authenticated: true 
                })
                // .redirect("/"); // Since this project is using React, the redirect will be handled on the client side
            });
          } else {
            return res
              .status(response.status)
              .json({ "login": response.login });
          }
        })
        .catch(error => {
          //TODO: fix this to actually return valid JSON and/or something useful
          res.json(error);
        });
    }).catch (error => {
      return res
        .status(404)
        .json({
          "ErrorMsg": "No record was found associated with that email address",
          "Error": error
        });
    });
  });  
}
