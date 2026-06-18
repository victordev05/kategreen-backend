const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// 🔐 ADMIN ONLY ACCESS
router.get("/users", auth, role("admin"), adminController.getUsers);

router.put("/block/:id", auth, role("admin"), adminController.blockUser);

router.put("/kyc/:id", auth, role("admin"), adminController.approveKYC);

router.get("/stats", auth, role("admin"), adminController.stats);

module.exports = router;