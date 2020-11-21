const jwt = require("jsonwebtoken");

const create = userId => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { user: userId },
      process.env.SECRET,
      { expiresIn: "1m" },
      (error, token) => {
        return error ? reject(error) : resolve(token);
      }
    );
  });
}

const createRefresh = clientId => {
  return new Promise((resolve, reject) => {
    const clientId = process.env.CLIENT_ID;
    
    jwt.sign(
      { clientId },
      process.env.SECRET_REFRESH,
      (error, token) => {
        return error ? reject(error) : resolve(token);
      }
    )
  })
};

module.exports = { create, createRefresh };
