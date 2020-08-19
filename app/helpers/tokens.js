const jwt = require("jsonwebtoken");

const create = userId => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {user: userId},
      process.env.SECRET,
      { expiresIn: "1h" },
      (error, token) => {
        return error ? reject(error) : resolve(token);
      }
    );
  });
}

module.exports = { create };
