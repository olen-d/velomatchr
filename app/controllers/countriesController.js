// Models
const { Country } = require("../models");

exports.read_one_country_by_alpha_two = (req, res) => {
  const alphaTwo = req.params.alphatwo;

  Country.findOne({
    where: {
      "alpha2": alphaTwo
    }
  })
  .then(result => {
    if (result) {
      res.send({ country: result });
    } else {
      res.send({ country: { name: "error" } });
    }
  })
  .catch(err => {
    res.json(err);
  });
};
