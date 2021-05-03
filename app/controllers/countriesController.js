// Models
const { Country } = require("../models");

// Services
const countryServices = require("../services/countryServices");

exports.read_all_countries = async (req, res) => {
  try {
    const data = await countryServices.read_all_countries();
    if (data) {
      res.status(200).json({ status: 200, data });
    } else {
      res.status(404).json({ status: 404, message: "Not Found", error: "No countries were found." });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal Server Error", error: error.message });
  }
};

exports.read_one_country_by_alpha_two = async (req, res) => {
  const { params: { alphatwo = "BLANK" }, } = req;
  const adminAreaType = "country";

  try {
    const result = await Country.findOne({
      where: {
        "alpha2": alphatwo
      }
    });
    if (result) {
      res.status(200).json({ status: 200, adminAreaType, country: result });
    } else {
      res.status(404).json({ status: 404, message: "Not Found", error: `No country associated with "${alphatwo}" was found.`, adminAreaType });
    }
  } catch(error) {
    res.status(500).json({ status: 500, message: "Internal Server Error", error: error.message, adminAreaType });
  }
};
