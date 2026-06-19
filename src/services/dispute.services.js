const prisma = require("../config/prisma");

// 🚨 CREATE DISPUTE
async function createDispute(data) {
  const { orderId, userId, reason } = data;

  const dispute = await prisma.dispute.create({
    data: {
      orderId,
      userId,
      reason,
      status: "OPEN",
    },
  });

  return dispute;
}

// 🛡️ RESOLVE DISPUTE (ADMIN ONLY)
async function resolveDispute(disputeId, action) {
  return await prisma.$transaction(async (tx) => {
    const dispute = await tx.dispute.findUnique({
      where: { id: disputeId },
    });

    if (!dispute) throw new Error("Dispute not found");

    const order = await tx.order.findUnique({
      where: { id: dispute.orderId },
    });

    if (action === "REFUND") {
      await tx.wallet.update({
        where: { userId: order.buyerId },
        data: {
          availableBalance: {
            increment: order.totalPrice,
          },
        },
      });

      await tx.ledger.create({
        data: {
          userId: order.buyerId,
          type: "DISPUTE_REFUND",
          amount: order.totalPrice,
          direction: "CREDIT",
          reference: DSP-REF-${Date.now()},
          status: "SUCCESS",
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "DISPUTED_REFUNDED",
          escrowStatus: "REFUNDED",
        },
      });
    }

    if (action === "RELEASE") {
      await tx.wallet.update({
        where: { userId: order.farmerId },
        data: {
          availableBalance: {
            increment: order.totalPrice,
          },
        },
      });

      await tx.ledger.create({
        data: {
          userId: order.farmerId,
          type: "DISPUTE_RELEASE",
          amount: order.totalPrice,
          direction: "CREDIT",
          reference: DSP-REL-${Date.now()},
          status: "SUCCESS",
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "DISPUTED_RESOLVED",
          escrowStatus: "RELEASED",
        },
      });
    }

    await tx.dispute.update({
      where: { id: disputeId },
      data: {
        status: "RESOLVED",
      },
    });

    return { message: "Dispute resolved successfully" };
  });
}

module.exports = {
  createDispute,
  resolveDispute,
};