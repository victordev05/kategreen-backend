const prisma = require("../config/prisma");

async function getAllUsers() {
  return await prisma.user.findMany({
    include: {
      wallet: true
    }
  });
}
async function blockUser(userId) {
  return await prisma.user.update({
    where: { id: userId },
    data: { accountStatus: "blocked" }
  });
}
async function approveKYC(userId) {
  return await prisma.user.update({
    where: { id: userId },
    data: { kycStatus: "approved" }
  });
}
async function getStats() {
  const users = await prisma.user.count();
  const orders = await prisma.order.count();
  const wallets = await prisma.wallet.findMany();

  const totalBalance = wallets.reduce(
    (sum, w) => sum + w.availableBalance,
    0
  );

  return {
    users,
    orders,
    totalBalance
  };
}
const prisma = require("../config/prisma");

// 👥 GET ALL USERS
async function getAllUsers() {
  return await prisma.user.findMany({
    include: {
      wallet: true,
    },
  });
}

// 💰 GET ALL TRANSACTIONS (LEDGER)
async function getAllTransactions() {
  return await prisma.ledger.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

// 🧾 GET ALL ORDERS
async function getAllOrders() {
  return await prisma.order.findMany();
}

// 🛡️ GET ALL DISPUTES
async function getAllDisputes() {
  return await prisma.dispute.findMany();
}

module.exports = {
  getAllUsers,
  getAllTransactions,
  getAllOrders,
  getAllDisputes,
};