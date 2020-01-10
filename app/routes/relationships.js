const express = require("express");
const router = express.Router();

const relationships_controller = require("../controllers/relationshipsController");

router.post("/relationships/create", relationships_controller.update_relationships);

module.exports = router;
