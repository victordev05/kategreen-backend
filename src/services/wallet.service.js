const prisma = require("../config/prisma");

// 💰 GET WALLET
async function getWallet(userId) {
  return await prisma.wallet.findUnique({
    where: { userId },
  });
}

// 💰 CREATE WALLET
async function createWallet(userId) {
  return await prisma.wallet.create({
    data: {
      userId,
      availableBalance: 0,
      pendingBalance: 0,
      frozenBalance: 0,
    },
  });
}

// 💰 DEPOSIT (SAFE)
async function deposit(userId, amount) {
  if (amount <= 0) throw new Error("Invalid amount");

  return await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.update({
      where: { userId },
      data: {
        availableBalance: {
          increment: amount,
        },
      },
    });

    await tx.ledger.create({
      data: {
        userId,
        type: "DEPOSIT",
        amount,
        direction: "CREDIT",
        reference: DEP-${Date.now()},
        status: "SUCCESS",
      },
    });

    return wallet;
  });
}

// 💸 TRANSFER (SAFE)
async function transfer(senderId, receiverId, amount) {
  if (amount <= 0) throw new Error("Invalid amount");
  if (senderId === receiverId) throw new Error("Cannot transfer to yourself");

  return await prisma.$transaction(async (tx) => {
    const senderWallet = await tx.wallet.findUnique({
      where: { userId: senderId },
    });

    if (!senderWallet) throw new Error("Sender wallet not found");
    if (senderWallet.availableBalance < amount) {
      throw new Error("Insufficient balance");
    }

    // debit sender
    await tx.wallet.update({
      where: { userId: senderId },
      data: {
        availableBalance: {
          decrement: amount,
        },
      },
    });

    // credit receiver
    await tx.wallet.update({
      where: { userId: receiverId },
      data: {
        availableBalance: {
          increment: amount,
        },
      },
    });

    // ledger sender
    await tx.ledger.create({
      data: {
        userId: senderId,
        type: "TRANSFER",
        amount,
        direction: "DEBIT",
        reference: TRF-${Date.now()},
        status: "SUCCESS",
      },
    });

    // ledger receiver
    await tx.ledger.create({
      data: {
        userId: receiverId,
        type: "TRANSFER",
        amount,
        direction: "CREDIT",
        reference: TRF-${Date.now()},
        status: "SUCCESS",
      },
    });

    return { message: "Transfer successful" };
  });
}

module.exports = {
  getWallet,
  createWallet,
  deposit,
  transfer,
};