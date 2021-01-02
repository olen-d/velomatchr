const express = require("express");

const router = express.Router();

const authorizeJWT = require("../helpers/authorize-jwt");
const imageUpload = require("../helpers/upload-image");

const users_controller = require("../controllers/usersController");

router.get("/users/email/is-available/:email", authorizeJWT, users_controller.read_email_is_available);
router.get("/users/email/:email", users_controller.read_one_user_id_by_email); // Meant to be used with password reset, authorization not required
router.get("/users/id/:userId", authorizeJWT, users_controller.read_one_user_by_id);
router.get("/users/matches/preferences/:userId", authorizeJWT, users_controller.read_one_user_and_matches_preferences);
router.get("/users/notifications/preferences/:userId", authorizeJWT, users_controller.read_one_user_and_notifications_preferences);
router.get("/users/password/reset/:id/:token", users_controller.read_one_user_password_reset_by_id); // Meant to be used with password reset, authentication not required
router.get("/users/username/:username", authorizeJWT, users_controller.read_one_user_by_username);

router.post("/users/create", users_controller.create_user); // TODO: Require API Key
router.post("/users/email/verify", authorizeJWT, users_controller.read_one_email_verification);
router.post("/users/email/send/verification",authorizeJWT, users_controller.email_send_verification);
router.post("/users/password/authenticate", authorizeJWT, users_controller.read_one_user_password_authenticate);
router.post("/users/password/reset", users_controller.password_reset); // Meant to be used with password reset, authentication not required
router.post("/users/profile/update/photograph", authorizeJWT, imageUpload, users_controller.profile_update_photograph);

router.put("/users/email/update", authorizeJWT, users_controller.email_update);
router.put("/users/email/verified/update", authorizeJWT, users_controller.email_verified_update);
router.put("/users/password/change", authorizeJWT, users_controller.password_change);
router.put("/users/password/update", users_controller.password_update); // Temporary token provided TODO: Require API Key
router.put("/users/profile/update/full", authorizeJWT, users_controller.profile_update_full);
router.put("/users/profile/update/required/", authorizeJWT, users_controller.profile_update_required);

router.delete("/users/email/verification/codes/id/:userId", authorizeJWT, users_controller.email_verified_code_delete_by_id);

module.exports = router;
