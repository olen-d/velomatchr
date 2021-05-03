// Models
const { Country } = require("../models");

// Utilities
const logger = require("../utilities/logger");

/**
 * @author Olen Daelhousen <hello@olen.dev>
 * @returns {object} - All country records with two and three letter alphabetical country codes, numeric country code, and country name
 */

exports.read_all_countries = async () => {
  try {
    const data = await Country.findAll({
      attributes: ["alpha2", "alpha3", "countryCode", "name"],
      order: [["name", "ASC"]]
    });
  
    return data;
  } catch (error) {
    logger.error(`server.service.country.read.all.countries ${error}`);
    throw new Error("Could not read all countries.");
  }
};
