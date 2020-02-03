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
router.get("/users/id/:userId", users_controller.read_one_user_by_id);
router.get("/users/matches/preferences/:userId", users_controller.read_one_user_and_matches_preferences);

router.post("/users/login", users_controller.read_login);

module.exports = router;
