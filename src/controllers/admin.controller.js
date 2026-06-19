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
const adminService = require("../services/admin.service");

// USERS
async function users(req, res) {
  try {
    const data = await adminService.getAllUsers();
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// TRANSACTIONS
async function transactions(req, res) {
  try {
    const data = await adminService.getAllTransactions();
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// ORDERS
async function orders(req, res) {
  try {
    const data = await adminService.getAllOrders();
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// DISPUTES
async function disputes(req, res) {
  try {
    const data = await adminService.getAllDisputes();
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  users,
  transactions,
  orders,
  disputes,
};