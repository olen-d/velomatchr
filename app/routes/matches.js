const express = require("express");
const router = express.Router();

const matches_controller = require("../controllers/matchesController");

router.post("/matches/preferences/submit", matches_controller.create_match_preferences);

module.exports = router;
