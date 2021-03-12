const express = require("express");

const router = express.Router();

const authorizeJWT = require("../helpers/authorize-jwt");

const relationships_controller = require("../controllers/relationshipsController");
//TODO - Remove CRUD references from the routes (i.e. relationships/create, /relationships/status/update, relationships/delete)
router.post("/relationships/create", authorizeJWT, relationships_controller.update_user_relationships);
router.post("/relationships/email-proxy", authorizeJWT, relationships_controller.create_email_proxy);

router.get("/relationships/email-address/:proxy", authorizeJWT, relationships_controller.read_email_address_by_proxy);
router.get("/relationships/email-proxy/id/:requesterid/:addresseeid", authorizeJWT, relationships_controller.read_email_proxy_by_id);
router.get("/relationships/matched/count/user/id/:userid", authorizeJWT, relationships_controller.read_user_matched_count_by_id);
router.get("/relationships/status/ids", authorizeJWT, relationships_controller.read_relationship_status_by_id);
router.get("/relationship/ids", authorizeJWT, relationships_controller.read_user_relationship_by_ids); // Requires parameters: addresseeid and requesterid
router.get("/relationships/user/id/:userid", authorizeJWT, relationships_controller.read_user_relationships_by_id);
router.get("/relationships/user/blocked/id/:userid", authorizeJWT, relationships_controller.read_user_relationships_blocked_by_id);

router.put("/relationships/status/update", authorizeJWT, relationships_controller.update_user_relationship_status);

router.delete("/relationships/delete/requester/id/:userid", authorizeJWT, relationships_controller.delete_user_relationships);

module.exports = router;
