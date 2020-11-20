// Models
const { User, RefreshToken } = require("../models");

// Packages
const jwt = require("jsonwebtoken");
const requestIp = require("request-ip");

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
        const clientIp = requestIp.getClientIp(req); 

        const refreshTokenCreate = await RefreshToken.create({
          userId: id,
          refreshToken,
          ipAddress: clientIp
        });

        if (!refreshTokenCreate) {
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
        // Password was not a match. Return a general error to avoid leaking valid 
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
  const { body: { userId: id, refreshToken }, headers: { referer }, } = req;
  const refreshTokenParsed = JSON.parse(refreshToken);
  const secret = process.env.SECRET_REFRESH;

  const verifyRefreshTokenResult = jwt.verify(refreshTokenParsed, secret, (error, decoded) => {
    return [error, decoded];
  });

  const [error, decoded ] = verifyRefreshTokenResult;

  if (error) {
    // TODO: Deal with the error
    console.log("authController.js / token_grant_type_refresh_token\nERROR:", error);
  } else {
    const { clientId } = decoded;
    const refererName = referer.split("://")[1].slice(0, -1); // discard http(s):// and the trailing /

    if (clientId === refererName) {
      // Authorized, issue a new token
      const clientIp = requestIp.getClientIp(req);

      try {
        const refreshTokenData = await RefreshToken.findOne({
          where: {
            userId: id,
            refreshToken: refreshTokenParsed,
            ipAddress: clientIp
          },
          attributes: ["userId", "refreshToken"]
        });
    
        if (refreshTokenData !== null) {
          const { userId, refreshToken } = refreshTokenData;
    
          const token = await tokens.create(userId);

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
    } else {
      // Not authorized, send a 403 forbidden.
    }
  }
};

exports.refresh_token_delete = async (req, res) => {
  const { body: { id: userId, refreshToken }, } = req;

  const ipAddress = requestIp.getClientIp(req);

  try {
    const refreshTokenDestroy = await RefreshToken.destroy(
      { where: { userId, ipAddress, refreshToken }}
    );
    
    if (refreshTokenDestroy !== 1) {
      // TODO: Log that there was an error deleting the refresh token
      console.log("AuthController Refresh Token Not Deleted");
    }
  } catch(error) {
    console.log("authController.js ERROR:", error);
  }
};
