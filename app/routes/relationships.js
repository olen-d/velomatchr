const express = require("express");

const router = express.Router();

const authorizeJWT = require("../helpers/authorize-jwt");

const relationships_controller = require("../controllers/relationshipsController");
//TODO - Remove CRUD references from the routes (i.e. relationships/create, /relationships/status/update, relationships/delete)
router.post("/relationships/create", authorizeJWT, relationships_controller.update_user_relationships);
router.post("/relationships/email-proxy", relationships_controller.create_email_proxy);

router.get("/relationships/email-proxy/requester/id/:requesterid/:addresseeid", relationships_controller.read_requester_email_proxy_by_id);
router.get("/relationships/matched/count/user/id/:userid", authorizeJWT, relationships_controller.read_user_matched_count_by_id);
router.get("/relationships/user/id/:userid", authorizeJWT, relationships_controller.read_user_relationships_by_id);

router.put("/relationships/status/update", authorizeJWT, relationships_controller.update_user_relationship_status);

router.delete("/relationships/delete/requester/id/:userid", authorizeJWT, relationships_controller.delete_user_relationships);

module.exports = router;
