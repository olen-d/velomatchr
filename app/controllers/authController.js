// Models
const { User } = require("../models");

// Packages
const { v4: uuidv4 } = require("uuid");

// Helpers
const bcrypt = require("../helpers/bcrypt-module");
const tokens = require("../helpers/tokens");

exports.token_grant_type_password = async (req, res) => {
  const { body: { clientId = "www.velomatchr.com", username, pass }, } = req;

  try {
    // Get the user id and encrypted password
    const userData = await User.findOne({
      where: {
        email: username
      },
      attributes: ["id", "password"]
    });
  
    // If the user exists, check the password and issue a token if it matches
    if (userData !== null) {
      const { id, password } = userData;
      const { login, status } = await bcrypt.checkPass(pass, password);
      if (status === 200 && login) {
        const refreshToken = await tokens.createRefresh(clientId); 

        const userUpdate = await User.update(
          { refreshToken },
          { where: { id }}
        );
        
        if (userUpdate[0] === 0) {
          // TODO: Log that there was an error creating the refresh token
        }

        // Issue the token
        const token = await tokens.create(id);

        res.status(200).json({
          token_type: "bearer",
          access_token: token,
          refresh_token: refreshToken
        });
      } else {
        // Password was not a match. Return a general error to avoid leaking valid usernames
        res.status(500).json({ status: 500, message: "Internal server error.", authenticated: false });
      }
    } else {
      // Username was not a match. Return a general error to avoid leaking valid usernames
      res.status(500).json({ status: 500, message: "Internal server error.", authenticated: false });
    }
  } catch(error) {
    // Epic Fail
    // TODO: Deal with the error
  }
};

exports.token_grant_type_refresh_token = async (req, res) => {
  const { body: { userId: id, refreshToken }, } = req;

  try {
    const userData = await User.findOne({
      where: {
        id,
        refreshToken
      },
      attributes: ["id", "refreshToken"]
    });

    if (userData !== null) {
      const { id, refreshToken } = userData;

      const token = await tokens.create(id);

      res.status(200).json({
        token_type: "bearer",
        access_token: token,
        refresh_token: refreshToken
      });
    } else {
      res.status(500).json({ status: 500, message: "Internal server error.", error: `Either the user ${id} does not exist or a refresh token was not found. ` });
    }
  } catch(error) {
    // Epic fail
    // TODO: Deal with the error
  }
};

exports.refresh_token_update = async (req, res) => {
  const { body: { id, refreshToken }, } = req;

  const userUpdate = await User.update(
    { refreshToken: "NULL" },
    { where: { id, refreshToken }}
  );
  
  if (userUpdate[0] === 0) {
    // TODO: Log that there was an error updating the refresh token
    console.log("AuthController Refresh Token Update Error");
  }
};
