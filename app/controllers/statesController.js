// Services
const stateServices = require("../services/stateServices");

exports.read_all_states = async (req, res) => {
  try {
    const data = await stateServices.read_all_states();
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
    const data = await stateServices.read_one_state_by_code(code)
    if (data) {
      res.status(200).json({ status: 200, adminAreaType, state: data });
    } else {
      res.status(404).json({ status: 404, message: "Not Found", error: `No state associated with "${code}" was found.`, adminAreaType });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal Server Error", error: error.message, adminAreaType });
  }
};
