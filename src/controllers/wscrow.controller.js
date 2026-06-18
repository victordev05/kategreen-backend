const escrowService = require("../services/escrow.service");

// LOCK FUNDS
exports.lock = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, orderId } = req.body;

    const result = await escrowService.lockEscrow(userId, amount, orderId);

    res.json(result);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};