const prisma = require("../config/prisma");

// Create wallet
async function createWallet(userId) {
  return await prisma.wallet.create({
    data: {
      userId,
    },
  });
}

// Get wallet
async function getWallet(userId) {
  return await prisma.wallet.findUnique({
    where: { userId },
  });
}

// Add balance
async function addBalance(userId, amount) {
  return await prisma.wallet.update({
    where: { userId },
    data: {
      availableBalance: {
        increment: amount,
      },
    },
  });
}

module.exports = {
  createWallet,
  getWallet,
  addBalance,
};