// Models
const { State } = require("../models");

exports.read_one_state_by_code = (req, res) => {
  const code = req.params.code;

  State.findOne({
    where: {
      code
    }
  })
  .then(result => {
    if (result) {
      res.send({ state: result });
    } else {
      res.send({ state: { name: "error" } });
    }
  })
  .catch(err => {
    res.json(err);
  });
};
