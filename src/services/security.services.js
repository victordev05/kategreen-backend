const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

// 🔐 SET TRANSACTION PIN
async function setPin(userId, pin) {
  const hashedPin = await bcrypt.hash(pin, 10);

  return await prisma.user.update({
    where: { id: userId },
    data: {
      transactionPin: hashedPin
    }
  });
}

module.exports = { setPin };
const bcrypt = require("bcrypt");

async function verifyPin(user, inputPin) {
  if (!user.transactionPin) {
    throw new Error("PIN not set");
  }

  const match = await bcrypt.compare(inputPin, user.transactionPin);

  if (!match) {
    throw new Error("Invalid transaction PIN");
  }

  return true;
}
async function transferMoney(senderId, receiverId, amount, pin) {
  return await prisma.$transaction(async (tx) => {

    const sender = await tx.user.findUnique({
      where: { id: senderId }
    });

    // 🔐 VERIFY PIN FIRST
    const valid = await require("bcrypt").compare(pin, sender.transactionPin);

    if (!valid) {
      throw new Error("Invalid PIN");
    }

    const senderWallet = await tx.wallet.findUnique({
      where: { userId: senderId }
    });

    const receiverWallet = await tx.wallet.findUnique({
      where: { userId: receiverId }
    });

    if (senderWallet.availableBalance < amount) {
      throw new Error("Insufficient balance");
    }

    await tx.wallet.update({
      where: { userId: senderId },
      data: {
        availableBalance: { decrement: amount }
      }
    });

    await tx.wallet.update({
      where: { userId: receiverId },
      data: {
        availableBalance: { increment: amount }
      }
    });

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

    return { message: "Transfer successful" };
  });
}