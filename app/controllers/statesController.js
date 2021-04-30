// Models
const { State } = require("../models");
// ! TODO: Order by name ASC
exports.read_all_states = async (req, res) => {
  try {
    const data = await State.findAll({
      attributes: ["code", "name"]
    });
  
    if (data) {
      res.status(200).json({ status: 200, data });
    } else {
      res.status(404).json({ status: 404, message: "Not Found", error: "No states were found." });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal Server Error", error: error.message });
  }
};

exports.read_one_state_by_code = async (req, res) => {
  const { params: { code = "BLANK" }, } = req;
  const adminAreaType = "state";

  try {
    const result = await State.findOne({
      where: {
        code
      }
    });
    if (result) {
      res.status(200).json({ status: 200, adminAreaType, state: result });
    } else {
      res.status(404).json({ status: 404, message: "Not Found", error: `No state associated with "${code}" was found.`, adminAreaType });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal Server Error", error: error.message, adminAreaType });
  }
};
