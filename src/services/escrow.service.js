const prisma = require("../config/prisma");

async function lockEscrow(userId, amount, orderId) {
  return await prisma.$transaction(async (tx) => {

    const wallet = await tx.wallet.findUnique({
      where: { userId }
    });

    if (wallet.availableBalance < amount) {
      throw new Error("Insufficient balance for escrow");
    }

    // Move money: available → pending
    await tx.wallet.update({
      where: { userId },
      data: {
        availableBalance: { decrement: amount },
        pendingBalance: { increment: amount }
      }
    });

    // Ledger entry
    await tx.ledger.create({
      data: {
        userId,
        type: "escrow_hold",
        amount,
        direction: "debit",
        reference: "ESC-LOCK-" + Date.now(),
        status: "success"
      }
    });

    return {
      message: "Funds locked in escrow",
      orderId
    };
  });
}

module.exports = {
  lockEscrow
};
async function releaseEscrow(buyerId, farmerId, amount, orderId) {
  return await prisma.$transaction(async (tx) => {

    // 1. Deduct from buyer pending
    await tx.wallet.update({
      where: { userId: buyerId },
      data: {
        pendingBalance: { decrement: amount }
      }
    });

    // 2. Credit farmer available balance
    await tx.wallet.update({
      where: { userId: farmerId },
      data: {
        availableBalance: { increment: amount }
      }
    });

    // 3. Ledger for buyer
    await tx.ledger.create({
      data: {
        userId: buyerId,
        type: "escrow_release",
        amount,
        direction: "debit",
        reference: "ESC-REL-" + Date.now(),
        status: "success"
      }
    });

    // 4. Ledger for farmer
    await tx.ledger.create({
      data: {
        userId: farmerId,
        type: "escrow_release",
        amount,
        direction: "credit",
        reference: "ESC-REL-" + Date.now(),
        status: "success"
      }
    });

    return {
      message: "Escrow released to farmer"
    };
  });
}
async function freezeEscrow(userId, amount) {
  return await prisma.wallet.update({
    where: { userId },
    data: {
      pendingBalance: { decrement: amount },
      frozenBalance: { increment: amount }
    }
  });
}
const prisma = require("../config/prisma");

// 🔒 LOCK FUNDS IN ESCROW (ON ORDER CREATION OR PAYMENT)
async function lockEscrow(orderId, amount) {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.update({
      where: { id: orderId },
      data: {
        escrowStatus: "LOCKED",
      },
    });

    await tx.ledger.create({
      data: {
        userId: order.buyerId,
        type: "ESCROW_LOCK",
        amount,
        direction: "DEBIT",
        reference: ESC-${Date.now()},
        status: "SUCCESS",
      },
    });

    return order;
  });
}

// 🔓 RELEASE FUNDS TO FARMER
async function releaseEscrow(orderId) {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");

    // update escrow status
    await tx.order.update({
      where: { id: orderId },
      data: {
        escrowStatus: "RELEASED",
        status: "COMPLETED",
      },
    });

    // credit farmer wallet
    await tx.wallet.update({
      where: { userId: order.farmerId },
      data: {
        availableBalance: {
          increment: order.totalPrice,
        },
      },
    });

    // ledger for farmer
    await tx.ledger.create({
      data: {
        userId: order.farmerId,
        type: "ESCROW_RELEASE",
        amount: order.totalPrice,
        direction: "CREDIT",
        reference: REL-${Date.now()},
        status: "SUCCESS",
      },
    });

    return { message: "Escrow released successfully" };
  });
}

// 🔄 REFUND BUYER
async function refundEscrow(orderId) {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");

    await tx.order.update({
      where: { id: orderId },
      data: {
        escrowStatus: "REFUNDED",
        status: "CANCELLED",
      },
    });

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
        type: "ESCROW_REFUND",
        amount: order.totalPrice,
        direction: "CREDIT",
        reference: REF-${Date.now()},
        status: "SUCCESS",
      },
    });

    return { message: "Refund completed" };
  });
}

module.exports = {
  lockEscrow,
  releaseEscrow,
  refundEscrow,
};