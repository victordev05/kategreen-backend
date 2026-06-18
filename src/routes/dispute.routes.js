const express = require("express");
const router = express.Router();

const disputeController = require("../controllers/dispute.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, disputeController.open);

module.exports = router;