async function openDispute(orderId, reason) {
  return await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "disputed"
    }
  });
}
async function freezeFunds(userId, amount) {
  return await prisma.wallet.update({
    where: { userId },
    data: {
      pendingBalance: { decrement: amount },
      frozenBalance: { increment: amount }
    }
  });
}
async function refundBuyer(userId, amount) {
  return await prisma.wallet.update({
    where: { userId },
    data: {
      availableBalance: { increment: amount }
    }
  });
}