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
const escrowService = require("../services/escrow.service");

// LOCK
async function lock(req, res) {
  try {
    const { orderId, amount } = req.body;

    const result = await escrowService.lockEscrow(orderId, amount);

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// RELEASE
async function release(req, res) {
  try {
    const { orderId } = req.body;

    const result = await escrowService.releaseEscrow(orderId);

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// REFUND
async function refund(req, res) {
  try {
    const { orderId } = req.body;

    const result = await escrowService.refundEscrow(orderId);

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  lock,
  release,
  refund,
};
const disputeService = require("../services/dispute.service");

// CREATE DISPUTE
async function create(req, res) {
  try {
    const dispute = await disputeService.createDispute({
      userId: req.user.userId,
      ...req.body,
    });

    res.status(201).json(dispute);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// RESOLVE DISPUTE (ADMIN)
async function resolve(req, res) {
  try {
    const { disputeId, action } = req.body;

    const result = await disputeService.resolveDispute(
      disputeId,
      action
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  create,
  resolve,
};