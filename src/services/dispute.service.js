const prisma = require("../config/prisma");

// 🛑 OPEN DISPUTE
async function openDispute(orderId, reason, userId) {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");

    if (order.status === "COMPLETED") {
      throw new Error("Cannot dispute completed order");
    }

    const dispute = await tx.dispute.create({
      data: {
        orderId,
        userId,
        reason,
        status: "OPEN",
      },
    });

    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "DISPUTED",
      },
    });

    return dispute;
  });
}

// 🧊 FREEZE FUNDS
async function freezeFunds(userId, amount) {
  return await prisma.wallet.update({
    where: { userId },
    data: {
      pendingBalance: { decrement: amount },
      frozenBalance: { increment: amount },
    },
  });
}

// 💰 REFUND BUYER SAFELY
async function refundBuyer(userId, amount) {
  return await prisma.wallet.update({
    where: { userId },
    data: {
      frozenBalance: { decrement: amount },
      availableBalance: { increment: amount },
    },
  });
}

module.exports = {
  openDispute,
  freezeFunds,
  refundBuyer,
};