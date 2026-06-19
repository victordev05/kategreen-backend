const prisma = require("../config/prisma");

// 🛒 CREATE ORDER + ESCROW LOCK
async function createOrder(data) {
  const { buyerId, farmerId, productId, quantity } = data;

  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");
    if (quantity <= 0) throw new Error("Invalid quantity");

    const totalPrice = product.price * quantity;

    // check wallet
    const wallet = await tx.wallet.findUnique({
      where: { userId: buyerId },
    });

    if (!wallet) throw new Error("Buyer wallet not found");

    if (wallet.availableBalance < totalPrice) {
      throw new Error("Insufficient balance");
    }

    // 🔒 MOVE MONEY INTO ESCROW (CRITICAL FIX)
    await tx.wallet.update({
      where: { userId: buyerId },
      data: {
        availableBalance: {
          decrement: totalPrice,
        },
        pendingBalance: {
          increment: totalPrice,
        },
      },
    });

    // create order
    const order = await tx.order.create({
      data: {
        buyerId,
        farmerId,
        productId,
        quantity,
        totalPrice,
        status: "PENDING",
        escrowStatus: "LOCKED",
      },
    });

    // ledger entry
    await tx.ledger.create({
      data: {
        userId: buyerId,
        type: "ORDER_PAYMENT",
        amount: totalPrice,
        direction: "DEBIT",
        reference: ORD-${Date.now()},
        status: "SUCCESS",
      },
    });

    return order;
  });
}

module.exports = {
  createOrder,
};