const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const auth = require("../middleware/auth.middleware");

// create order
router.post("/", auth, orderController.create);

module.exports = router;