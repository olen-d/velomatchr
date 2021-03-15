// Models
const { User, RefreshToken } = require("../models");

// Packages
const jwt = require("jsonwebtoken");
const requestIp = require("request-ip");

// Helpers
const bcrypt = require("../helpers/bcrypt-module");
const tokens = require("../helpers/tokens");

exports.token_grant_type_client_credentials = async (req, res) => {
  const { body: { clientId, clientSecret, endUserId, endUserIp }, } = req;

  // TODO: Move these to the database and update this section
  const storedClientId = process.env.CLIENT_ID;
  const storedClientSecret = process.env.CLIENT_SECRET;

  try {
    // If the clientId exists, check the client secret and issue a token if it matches
    // TODO: move the storedClientId and storedClientSecret to the database and update this section
    if (clientId === storedClientId) {
      if (clientSecret === storedClientSecret) {
        const tokens = await createTokens(clientId, endUserIp, endUserId);
        res.status(200).json(tokens);
      } else {
      // ClientSecret was not a match. Return a general error to avoid leaking valid client ids
      res.status(500).json({ status: 500, message: "Internal server error.", authenticated: false });        
      }
    } else {
      // ClientId was not a match. Return a general error to avoid leaking valid client ids
      res.status(500).json({ status: 500, message: "Internal server error.", authenticated: false });
    }
  } catch(error) {
    // TODO: Deal with the error...

  }
};

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
  
    // If the user exists, check the password and issue a token if it matches
    if (userData !== null) {
      const { id, password } = userData;
      const { login, status } = await bcrypt.checkPass(pass, password);
      if (status === 200 && login) {
        const refreshToken = await tokens.createRefresh(id); 
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

  const secret = process.env.SECRET_REFRESH;

  const verifyRefreshTokenResult = jwt.verify(refreshToken, secret, (error, decoded) => {
    return [error, decoded];
  });

  const [error, decoded ] = verifyRefreshTokenResult;

  if (error) {
    res.status(500).json({ status: 500, message: "Internal server error.", error });
  } else {
    const { clientId } = decoded;
    const refererName = referer.split("://")[1].split("/")[0]; // discard http(s):// and anything after the top level domain

    if (clientId === refererName) {
      // Authorized, issue a new token
      const clientIp = requestIp.getClientIp(req);

      try {
        const refreshTokenData = await RefreshToken.findOne({
          where: {
            userId: id,
            refreshToken: refreshToken,
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
        res.sendStatus(420);
      }
    } else {
      res.sendStatus(403);
    }
  }
};

// Delete
exports.refresh_token_delete = async (req, res) => {
  const { body: { id: userId, refreshToken }, } = req;

  const ipAddress = requestIp.getClientIp(req);
  try {
    const refreshTokenDestroy = await RefreshToken.destroy(
      { where: { userId, ipAddress, refreshToken }}
    );
    
    if (refreshTokenDestroy !== 1) {
      // TODO: Log that there was an error deleting the refresh token
      res.status(500).json({ status: 500, message: "Internal Server Error", error: "The refresh token was not deleted." });
    } else {
      res.status(204).end();
    }
  } catch(error) {
    res.status(500).json({ status: 500, message: "Internal Server Error", error });
  }
};

exports.refresh_token_delete_all = async (req, res) => {
  const { params: { userId }, } = req;
  
  try {
    const refreshTokenDestroyAll = await RefreshToken.destroy(
      { where: { userId} }
    );

    if (refreshTokenDestroyAll === 0) {
      // TODO: Consider logging that no refresh tokens were deleted. This isn't necessarily an error, since if a user was logged out, there would be no refresh tokens to destroy.
    }

    res.status(200).json({ status: 200, message: "ok", data: { refreshTokensDestroyed: refreshTokenDestroyAll } });

  } catch(error) {
    console.log("authcontroller.js\nRefresh Token Delete All\nERROR:", error);
  }
}
// Functions
const createTokens = (clientId, clientIp, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const refreshToken = await tokens.createRefresh(userId); 

      const refreshTokenCreate = await RefreshToken.create({
        userId,
        refreshToken,
        ipAddress: clientIp
      });
  
      if (!refreshTokenCreate) {
        // TODO: Log that there was an error creating the refresh token
      }
  
      // Issue the token
      const token = await tokens.create(userId);
  
      resolve({
        token_type: "bearer",
        access_token: token,
        refresh_token: refreshToken
      });
    } catch(error) {
      reject(error);
    }
  })
}
