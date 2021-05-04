const express = require("express");
const router = express.Router();

const states_controller = require("../controllers/statesController");

router.get("/states", states_controller.read_all_states);
router.get("/states/code/:code", states_controller.read_one_state_by_code);

module.exports = router;
