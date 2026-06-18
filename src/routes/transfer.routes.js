const express = require("express");
const router = express.Router();

const transferController = require("../controllers/transfer.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, transferController.transfer);

module.exports = router;