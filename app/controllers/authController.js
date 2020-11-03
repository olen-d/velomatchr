// Models
const { User } = require("../models");

// Packages
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

// Helpers
const bcrypt = require("../helpers/bcrypt-module");

exports.token_grant_type_password = async (req, res) => {
  const { body: { username, pass }, } = req;

  try {
    // Get the user id and encrypted password
    const userData = await User.findOne({
      where: {
        email: username
      },
      attributes: ["id", "password"]
    });
  
    // Check the password
    if (userData !== null) {
      const { id, password } = userData;
      const { login, status } = await bcrypt.checkPass(pass, password);
      if (status === 200 && login) {
        const regex = /-/g;
        const refreshToken = uuidv4().replace(regex, "");

        const userUpdate = await User.update(
          { refreshToken },
          { where: { id }}
        );
        
        if (userUpdate[0] === 0) {
          // TODO: Log that there was an error creating the refresh token
        }

        // Issue the token
        jwt.sign(
          {user: id},
          process.env.SECRET,
          { expiresIn: "1h" },
          (err, token) => {
            res.status(200).json({
              token_type: "bearer",
              access_token: token,
              refresh_token: refreshToken
            });
          }
        );
      } else {
        res.status(500).json({ status: 500, message: "Internal server error.", authenticated: false });
      }
    } else {
      res.status(500).json({ status: 500, message: "Internal server error.", authenticated: false });
    }
  } catch(error) {
    // Epic Fail
  }

}

exports.token_grant_type_refresh_token = (req, res) => {

  // Refreshtoken
  // Check Refreshtoken against the DB
  // If match, then we're good, issue a new access token
  const data = "Refresh Token";
  res.status(200).json({ status: 200, message: "ok", data });
}
