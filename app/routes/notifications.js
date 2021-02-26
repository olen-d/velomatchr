const express = require("express");

const router = express.Router();

const authorizeJWT = require("../helpers/authorize-jwt");

const notifications_controller = require("../controllers/notificationsController");

router.post("/notifications/preferences", authorizeJWT, notifications_controller.create_notification_preferences);
router.post("/notifications/send/new-match-request", authorizeJWT, notifications_controller.send_new_match_request);

router.put("/notifications/preferences", authorizeJWT, notifications_controller.update_notification_preferences);

module.exports = router;
