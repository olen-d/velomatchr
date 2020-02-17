const express = require("express");
const router = express.Router();

const matches_controller = require("../controllers/matchesController");

router.post("/matches/preferences/submit", matches_controller.update_match_preferences);

router.get("/matches/near/location/:lat/:long", matches_controller.read_matches_nearby);
router.get("/matches/user/:userid", matches_controller.read_user_matches);
router.get("/matches/preferences/user/:userid", matches_controller.read_user_matches_preferences);

router.post("/matches/calculate", matches_controller.calculate_user_matches);

module.exports = router;
