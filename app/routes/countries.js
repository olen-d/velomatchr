const express = require("express");
const router = express.Router();

const countries_controller = require("../controllers/countriesController");

router.get("/countries", countries_controller.read_all_countries);
router.get("/countries/alphatwo/:alphatwo", countries_controller.read_one_country_by_alpha_two);

module.exports = router;
