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