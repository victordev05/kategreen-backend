const express = require("express");
const router = express.Router();

const deliveryController = require("../controllers/delivery.controller");
const auth = require("../middleware/auth.middleware");

// logistics updates delivery
router.post("/update", auth, deliveryController.update);

// buyer confirms delivery
router.post("/confirm", auth, deliveryController.confirm);

module.exports = router;