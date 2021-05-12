// Models
const { User } = require("../models");

// Utilities
const logger = require("../utilities/logger");

/**
 * Create a new user in the database
 * @author Olen Daelhousen <hello@olen.dev>
 * @param {string} city - Name of the user's home city
 * @param {string} country - Name of the user's home country
 * @param {string} countryCode - ISO two letter code for the user's home country
 * @param {string} email - The user's email address
 * @param {number} emailIsVerified - 0 if the email has not been verified, 1 if the email was verified
 * @param {number} latitude - Latitude of the user's location
 * @param {number} longitude - Longitude of the user's location
 * @param {string} name - Unique user name
 * @param {string} password - Hash of the user's password
 * @param {string} postalCode - Home postal code of the user
 * @param {string} state - Home state of the user
 * @param {string} stateCode - Two letter code for the user's home state
 * @returns {Promise<object>} - The user record inserted into the database, keys are field names and values are what was inserted. Includes id, createdAt, and updatedAt in addition to the parameters
 */

exports.create_user = async (city, country, countryCode, email, emailIsVerified, latitude, longitude, name, password, postalCode, state, stateCode) => {
  try {
    const createUserResult = await User.create({
      name,
      password,
      email,
      emailIsVerified,
      latitude,
      longitude,
      city,
      state,
      stateCode,
      country,
      countryCode,
      postalCode
    });
    return createUserResult;

  } catch (error) {
    // Check for sequelize errors
    if (error.name === "SequelizeUniqueConstraintError") {
      logger.error("server.service.users.create.user.sequelize.constraint");
      throw new Error("Sequelize unique constraint error");
    } else if (error.name === "SequelizeValidationError") {
      logger.error("server.service.users.create.user.sequelize.validation")
      throw new Error("Sequelize validation error");
    } else {
      logger.error(`server.service.users.create.user ${error}`);
      throw new Error("Could not create user.");
    }
  }
};

// Update Services

/**
 * 
 * @param {string} city - Name of the user's home city
 * @param {string} country - Name of the user's home country
 * @param {string} countryCode - ISO two letter code for the user's home country
 * @param {string} id - User Id
 * @param {number} latitude - Latitude of the user's location
 * @param {number} longitude - Longitude of the user's location
 * @param {string} postalCode - Home postal code of the user
 * @param {string} state - Home state of the user
 * @param {string} stateCode - Two letter code for the user's home state
 * @returns {Promise<array>} - The number of records updated. 0 if no update occurred and 1 if the update was successful. 
 */

exports.update_user_location_all = async (city, country, countryCode, id, latitude, longitude, postalCode, state, stateCode) => {
  try {
    const updateResult = await User.update(
      {
        latitude,
        longitude,
        city,
        state,
        stateCode,
        country,
        countryCode,
        postalCode
      },
      { where: { id } }
    );
    return updateResult;

  } catch (error) {
    // Check for sequelize errors
    if (error.name === "SequelizeUniqueConstraintError") {
      logger.error("server.service.users.update.user.location.all.sequelize.constraint");
      throw new Error("Sequelize unique constraint error");
    } else if (error.name === "SequelizeValidationError") {
      logger.error("server.service.users.update.user.location.all.sequelize.validation")
      throw new Error("Sequelize validation error");
    } else {
      logger.error(`server.service.users.update.user.location.all ${error}`);
      throw new Error("Could not update user location.");
    }
  }
};
