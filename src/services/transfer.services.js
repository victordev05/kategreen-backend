const prisma = require("../config/prisma");

async function transferMoney(senderId, receiverId, amount) {
  return await prisma.$transaction(async (tx) => {

    // 1. Get sender wallet
    const senderWallet = await tx.wallet.findUnique({
      where: { userId: senderId }
    });

    // 2. Get receiver wallet
    const receiverWallet = await tx.wallet.findUnique({
      where: { userId: receiverId }
    });

    if (!receiverWallet) {
      throw new Error("Receiver wallet not found");
    }

    // 3. Check balance
    if (senderWallet.availableBalance < amount) {
      throw new Error("Insufficient balance");
    }

    // 4. Debit sender
    await tx.wallet.update({
      where: { userId: senderId },
      data: {
        availableBalance: {
          decrement: amount
        }
      }
    });

    // 5. Credit receiver
    await tx.wallet.update({
      where: { userId: receiverId },
      data: {
        availableBalance: {
          increment: amount
        }
      }
    });

    // 6. Ledger for sender (DEBIT)
    await tx.ledger.create({
      data: {
        userId: senderId,
        type: "transfer",
        amount,
        direction: "debit",
        reference: "TRF-" + Date.now(),
        status: "success"
      }
    });

    // 7. Ledger for receiver (CREDIT)
    await tx.ledger.create({
      data: {
        userId: receiverId,
        type: "transfer",
        amount,
        direction: "credit",
        reference: "TRF-" + Date.now(),
        status: "success"
      }
    });

    return {
      message: "Transfer successful",
      amount
    };
  });
}

module.exports = {
  transferMoney
};
if (amount > 1000000) {
  throw new Error("Transfer limit exceeded");
}