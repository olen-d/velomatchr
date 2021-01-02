const express = require("express");

const router = express.Router();

const authorizeJWT = require("../helpers/authorize-jwt");

const notifications_controller = require("../controllers/notificationsController");

router.post("/notifications/preferences", notifications_controller.create_notification_preferences); // TODO: add authorizeJWT

router.put("/notifications/preferences", notifications_controller.update_notification_preferences); // TODO: add authorizeJWT

module.exports = router;
