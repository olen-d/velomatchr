const jwt = require("jsonwebtoken");

const create = userId => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { user: userId },
      process.env.SECRET,
      { expiresIn: "2m" },
      (error, token) => {
        return error ? reject(error) : resolve(token);
      }
    );
  });
}

const createRefresh = clientId => {
  return new Promise((resolve, reject) => {
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
