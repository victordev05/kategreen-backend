const express = require("express");
const router = express.Router();

const escrowController = require("../controllers/escrow.controller");
const auth = require("../middleware/auth.middleware");

router.post("/lock", auth, escrowController.lock);

module.exports = router;
const express = require("express");
const router = express.Router();

const escrowController = require("../controllers/escrow.controller");
const auth = require("../middleware/auth.middleware");

// protected routes
router.post("/lock", auth, escrowController.lock);
router.post("/release", auth, escrowController.release);
router.post("/refund", auth, escrowController.refund);

module.exports = router;