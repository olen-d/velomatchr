const express = require("express");
const router = express.Router();

const survey_controller = require("../controllers/surveyController");

router.post("/survey/submit", survey_controller.create_survey_response);

router.get("/survey/except/:userid", survey_controller.read_survey_response_except);

module.exports = router;
