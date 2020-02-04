const Sequelize = require("sequelize");

// Models
const { MatchPref, User } = require("../models");

// Packages
const jwt = require("jsonwebtoken");

// Helpers
// const auth = require("../helpers/auth-module");
const bcrypt = require("../helpers/bcrypt-module");

exports.create_user = (req, res) => {
  const { firstName, lastName, email, phone, password, gender, latitude, longitude } = req.body;

  bcrypt.newPass(password).then(pwdRes => {
    if(pwdRes.status === 200) {
      const name = firstName + "." + lastName.slice(0,1);
      const photoLink = req.file.path;

      User.create({
        name,
        password: pwdRes.passwordHash,
        firstName,
        lastName,
        email,
        phone,
        photoLink,
        gender,
        latitude,
        longitude,
        city: "blank",
        state: "blank",
        stateCode: "blank",
        country: "blank",
        countryCode: "bla"
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
        res.status(500).json({ error: err });
      });
    } else {
      res.status(500).json({ error: "userController 107" });
    }
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
