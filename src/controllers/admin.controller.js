const adminService = require("../services/admin.service");

// 👥 USERS
exports.getUsers = async (req, res) => {
  const users = await adminService.getAllUsers();
  res.json(users);
};

// 🚫 BLOCK USER
exports.blockUser = async (req, res) => {
  await adminService.blockUser(req.params.id);
  res.json({ message: "User blocked" });
};

// ✅ APPROVE KYC
exports.approveKYC = async (req, res) => {
  await adminService.approveKYC(req.params.id);
  res.json({ message: "KYC approved" });
};

// 📊 STATS
exports.stats = async (req, res) => {
  const data = await adminService.getStats();
  res.json(data);
};