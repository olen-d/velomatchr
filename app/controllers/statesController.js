// Models
const { State } = require("../models");

exports.read_one_state_by_code = (req, res) => {
  const code = req.params.code;

  State.findOne({
    where: {
      code
    }
  })
  .then(resolve => {
    let stateObj = {
      state: resolve
    };
    res.send(stateObj);
  })
  .catch(err => {
    res.json(err);
  });
};
