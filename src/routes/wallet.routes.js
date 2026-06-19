const express = require("express");
const router = express.Router();

const walletController = require("../controllers/wallet.controller");
const auth = require("../middleware/auth.middleware");

// all routes protected
router.get("/", auth, walletController.getWallet);
router.post("/deposit", auth, walletController.deposit);
router.post("/transfer", auth, walletController.transfer);

module.exports = router;