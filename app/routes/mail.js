const express = require("express");
const router = express.Router();

const authorizeJWT = require("../helpers/authorize-jwt");

const mail_controller = require("../controllers/mailController");

// authorizeJWT won't work because check-mx can be called before the user is created and therefore isn't authenticated
// TODO: require an API key for this route
router.get("/mail/check-mx/:email", mail_controller.check_mx);

router.post("/mail/match", mail_controller.mail_match);
router.post("/mail/send", authorizeJWT, mail_controller.send_mail);

module.exports = router;
