const express = require("express");

const router = express.Router();

const authorizeJWT = require("../helpers/authorize-jwt");
const imageUpload = require("../helpers/upload-image");

const users_controller = require("../controllers/usersController");
// TODO: Fix this to no longer require imageUpload, since no image is uploaded on the initial user creation.
router.post(
    "/users/create",
    imageUpload,
    users_controller.create_user
  );

router.get("/users/email/:email", users_controller.read_one_user_id_by_email); // Meant to be used with password reset, authorization not required
router.get("/users/id/:userId", authorizeJWT, users_controller.read_one_user_by_id);
router.get("/users/matches/preferences/:userId", authorizeJWT, users_controller.read_one_user_and_matches_preferences);
router.get("/users/password/reset/:id/:token", users_controller.read_one_user_password_reset_by_id); // Meant to be used with password reset, authentication not required
router.get("/users/username/:username", authorizeJWT, users_controller.read_one_user_by_username);

router.post("/users/email/verify", authorizeJWT, users_controller.read_one_email_verification);
router.post("/users/email/send/verification",authorizeJWT, users_controller.email_send_verification);
router.post("/users/login", users_controller.read_login);
router.post("/users/password/authenticate", users_controller.read_one_user_password_authenticate);
router.post("/users/password/reset", users_controller.password_reset);
router.post("/users/profile/photograph/update", imageUpload, users_controller.profile_photograph_update);

router.put("/users/email/update", users_controller.email_update);
router.put("/users/email/verified/update", authorizeJWT, users_controller.email_verified_update);
router.put("/users/password/change", users_controller.password_change);
router.put("/users/password/update", users_controller.password_update);
router.put("/users/profile/update/full", authorizeJWT, users_controller.profile_update_full);
router.put("/users/profile/update/required/", authorizeJWT, users_controller.profile_update_required);

router.delete("/users/email/verification/codes/delete/id/:userId", authorizeJWT, users_controller.email_verified_code_delete_by_id);

module.exports = router;
