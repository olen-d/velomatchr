const express = require("express");
const router = express.Router();

const imageUpload = require("../helpers/upload-image");

const users_controller = require("../controllers/usersController");
// TODO: Fix this to no longer require imageUpload, since no image is uploaded on the initial user creation.
router.post(
    "/users/create",
    imageUpload,
    users_controller.create_user
  );

router.get("/users/username/:username", users_controller.read_one_user_by_username);
router.get("/users/email/:email", users_controller.read_one_user_id_by_email);
router.get("/users/id/:userId", users_controller.read_one_user_by_id);
router.get("/users/matches/preferences/:userId", users_controller.read_one_user_and_matches_preferences);
router.get("/users/password/reset/:id/:token", users_controller.read_one_user_by_id_reset);

router.post("/users/login", users_controller.read_login);
router.post("/users/email/verify", users_controller.read_one_email_verification);
router.post("/users/email/send/verification", users_controller.send_email_verification_code);
router.post("/users/password/reset", users_controller.reset_user_password);
router.post("/users/profile/update/photograph", imageUpload, users_controller.create_user_profile_photograph);

router.put("/users/password/update", users_controller.update_user_password);
router.put("/users/profile/update/required/", users_controller.profile_update_required);
router.put("/users/profile/update/full", users_controller.profile_update_full);
router.put("/users/verified/update", users_controller.update_is_email_verified);

router.delete("/users/verification/codes/:userId", users_controller.delete_user_email_verification_codes);

module.exports = router;
