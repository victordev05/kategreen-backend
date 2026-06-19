const express = require("express");
const router = express.Router();

const disputeController = require("../controllers/dispute.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, disputeController.open);

module.exports = router;
const express = require("express");
const router = express.Router();

const disputeController = require("../controllers/dispute.controller");
const auth = require("../middleware/auth.middleware");

// user creates dispute
router.post("/", auth, disputeController.create);

// admin resolves dispute
router.post("/resolve", auth, disputeController.resolve);

module.exports = router;