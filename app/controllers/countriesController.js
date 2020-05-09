// Models
const { Country } = require("../models");

exports.read_one_country_by_alpha_two = (req, res) => {
  const alphaTwo = req.params.alphatwo;

  Country.findOne({
    where: {
      "alpha-2": alphaTwo
    }
  })
  .then(resolve => {
    let countryObj = {
      country: resolve
    };
    res.send(countryObj);
  })
  .catch(err => {
    res.json(err);
  });
};
