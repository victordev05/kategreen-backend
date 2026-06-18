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