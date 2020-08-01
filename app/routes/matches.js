const express = require("express");

const router = express.Router();

const authorizeJWT = require("../helpers/authorize-jwt");

const matches_controller = require("../controllers/matchesController");
// TODO: Add "id" to all routes using {userid}
router.post("/matches/preferences/submit", authorizeJWT, matches_controller.update_match_preferences);

router.get("/matches/near/location/:lat/:long", matches_controller.read_matches_nearby);
router.get("/matches/user/:userid", matches_controller.read_user_matches);
router.get("/matches/preferences/user/id/:userid", authorizeJWT, matches_controller.read_user_matches_preferences_by_id);

router.post("/matches/calculate", authorizeJWT, matches_controller.calculate_user_matches);

module.exports = router;
