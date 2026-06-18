const express = require("express");
const router = express.Router();

const escrowController = require("../controllers/escrow.controller");
const auth = require("../middleware/auth.middleware");

router.post("/lock", auth, escrowController.lock);

module.exports = router;