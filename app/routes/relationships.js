const express = require("express");
const router = express.Router();

const relationships_controller = require("../controllers/relationshipsController");

router.post("/relationships/create", relationships_controller.update_user_relationships);

router.get("/relationships/user/:userid", relationships_controller.read_user_relationships);
router.get("/relationships/matched/count/user/:userid", relationships_controller.read_user_matched_count);

router.put("/relationships/status/update", relationships_controller.update_user_relationship_status);

router.delete("/relationships/delete/requester/id/:userId", relationships_controller.delete_user_relationships);

module.exports = router;
