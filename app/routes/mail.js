const express = require("express");
const router = express.Router();

const mail_controller = require("../controllers/mailController");

router.post("/mail/send", mail_controller.send_mail);

module.exports = router;
