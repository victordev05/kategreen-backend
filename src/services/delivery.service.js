const prisma = require("../config/prisma");

// 🚚 UPDATE DELIVERY STATUS
async function updateDeliveryStatus(deliveryId, status, proofUrl, notes) {
  return await prisma.delivery.update({
    where: { id: deliveryId },
    data: {
      status,
      proofUrl,
      notes,
    },
  });
}

// ✅ CONFIRM DELIVERY (SAFE ESCROW RELEASE)
async function confirmDelivery(orderId) {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");

    // 🚨 BLOCK DOUBLE PAYMENT
    if (order.escrowStatus !== "LOCKED") {
      throw new Error("Escrow already processed");
    }

    if (order.status === "COMPLETED") {
      throw new Error("Order already completed");
    }

    // release funds to farmer
    await tx.wallet.update({
      where: { userId: order.farmerId },
      data: {
        availableBalance: {
          increment: order.totalPrice,
        },
      },
    });

    // remove escrow from buyer
    await tx.wallet.update({
      where: { userId: order.buyerId },
      data: {
        pendingBalance: {
          decrement: order.totalPrice,
        },
      },
    });

    // update order
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED",
        escrowStatus: "RELEASED",
      },
    });

    // ledger
    await tx.ledger.create({
      data: {
        userId: order.farmerId,
        type: "ORDER_COMPLETION",
        amount: order.totalPrice,
        direction: "CREDIT",
        reference: COM-${Date.now()},
        status: "SUCCESS",
      },
    });

    return { message: "Delivery confirmed and escrow released" };
  });
}

module.exports = {
  updateDeliveryStatus,
  confirmDelivery,
};