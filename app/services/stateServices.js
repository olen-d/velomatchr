// Models
const { State } = require("../models");

// Utilities
const logger = require("../utilities/logger");

/**
 * @author Olen Daelhousen <hello@olen.dev>
 * @returns {object} - All state records with two letter state abbreviation and state name.
 */

exports.read_all_states = async () => {
  try {
    const data = await State.findAll({
      attributes: ["code", "name"],
      order: [["name", "ASC"]]
    });

    return data;
  } catch (error) {
    logger.error(`server.service.state.read.all.states ${error}`);
    throw new Error("Could not read all states.");
  }
};

/**
 * @author Olen Daelhousen <hello@olen.dev>
 * @param {string} code - Two letter state abbreviation
 * @returns {object}  - State record that matches the two letter state abbreviation provided. 
 */

exports.read_one_state_by_code = async code => {
  try {
    const data = await State.findOne({
      where: {
        code
      }
    });

    return data;
  } catch (error) {
    logger.error(`server.service.state.read.one.state.by.code ${code} ${error}`);
    throw new Error(`Could not read state ${code}.`);
  }
};
