const express = require("express");

const router = express.Router();

const auth_controller = require("../controllers/authController");

router.post("/auth/token/grant-type/password", auth_controller.token_grant_type_password);
router.post("/auth/token/grant-type/refresh-token", auth_controller.token_grant_type_refresh_token);

module.exports = router;
