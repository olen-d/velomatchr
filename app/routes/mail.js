const express = require("express");
const router = express.Router();

const authorizeJWT = require("../helpers/authorize-jwt");

const mail_controller = require("../controllers/mailController");

router.get("/mail/check-mx/:email", authorizeJWT, mail_controller.check_mx);

router.post("/mail/send", authorizeJWT, mail_controller.send_mail);

module.exports = router;
