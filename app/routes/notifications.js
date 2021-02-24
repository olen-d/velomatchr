const express = require("express");

const router = express.Router();

const authorizeJWT = require("../helpers/authorize-jwt");

const notifications_controller = require("../controllers/notificationsController");

router.post("/notifications/preferences", authorizeJWT, notifications_controller.create_notification_preferences);

router.put("/notifications/preferences", authorizeJWT, notifications_controller.update_notification_preferences);

module.exports = router;
