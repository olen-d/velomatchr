const express = require("express");

const router = express.Router();

const authorizeJWT = require("../helpers/authorize-jwt");

const survey_controller = require("../controllers/surveyController");

router.post("/survey/submit", authorizeJWT, survey_controller.update_survey_response);

router.get("/survey/user/id/:userid", authorizeJWT, survey_controller.read_survey_response_by_id);
router.get("/survey/except/id/:userid", authorizeJWT, survey_controller.read_survey_response_except);

module.exports = router;
