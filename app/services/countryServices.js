// Models
const { Country } = require("../models");

// Utilities
const logger = require("../utilities/logger");

/**
 * @author Olen Daelhousen <hello@olen.dev>
 * @returns {object} - All country records with two and three letter alphabetical country codes, numeric country code, and country name.
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

/**
 * @author Olen Daelhousen <hello@olen.dev>
 * @param {string} alphatwo - ISO two letter country code
 * @returns {object} - Country record that matches the ISO two letter country code provided. 
 */

exports.read_one_country_by_alpha_two = async alphatwo => {
  try {
    const data = await Country.findOne({
      where: {
        "alpha2": alphatwo
      }
    });

    return data;
  } catch (error) {
    logger.error(`server.service.country.read.one.country.by.alpha.two ${alphatwo} ${error}`);
    throw new Error(`Could not read country ${alphatwo}.`);
  }
};
