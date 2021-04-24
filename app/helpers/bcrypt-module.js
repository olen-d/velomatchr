const bcrypt = require("bcryptjs");

const logger = require("../utilities/logger");

const saltRounds = 10;

// Hash a password, on error, set login to false

const newPass = password => {
  return new Promise((res, rej) => {
    try {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        logger.info("server.helper.bcrypt-module.newPass Successfuly encrypted password.");
        res({
          status: 200,
          passwordHash: hash,
          login: true
        });
      });
    } catch (err) {
      logger.error(`server.helper.bcrypt-module.newPass Failed to hash password. ${err}`);
      rej({
        status: 500,
        login: false,
        error: "Internal server error. Failed to hash password."
      });
    }
  });
}

// Check the password
const checkPass = (password, passwordHash) => {
  return new Promise((res, rej) => {
    try {
      bcrypt.compare(password, passwordHash, (err, result) => {
        if (result) {
          logger.info("server.helper.bcrypt-module.checkPass Successfuly matched password.");
          res({
            status: 200,
            login: true
          });
        } else {
          logger.error(`server.helper.bcrypt-module.checkPass Password did not match. ${err}`);
          res({
            status: 403,
            login: false
          });
        }
      });
    } catch (err) {
      logger.error(`server.helper.bcrypt-module.checkPass ${err}`);
      rej({
        status: 403,
        error: "Forbidden." + err,
        login: false
      });
    }
  });
};

module.exports = {
  newPass: newPass,
  checkPass: checkPass
};
