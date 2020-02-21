const express = require("express");
const router = express.Router();

const imageUpload = require("../helpers/upload-image");

const users_controller = require("../controllers/usersController");

router.post(
    "/users/create",
    imageUpload,
    users_controller.create_user
  );

router.get("/users/:username", users_controller.read_one_user);
router.get("/users/email/:email", users_controller.read_one_user_id_by_email);
router.get("/users/id/:userId", users_controller.read_one_user_by_id);
router.get("/users/matches/preferences/:userId", users_controller.read_one_user_and_matches_preferences);
router.get("/users/password/reset/:id/:token", users_controller.read_one_user_by_id_reset);

router.post("/users/login", users_controller.read_login);
router.post("/users/email/verify", users_controller.read_one_email_verification);
router.post("/users/password/reset", users_controller.reset_user_password);

router.put("/users/profile/required/update", users_controller.update_profile_required);
router.put("/users/verified/update", users_controller.update_is_email_verified);

module.exports = router;
