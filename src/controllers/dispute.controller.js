const disputeService = require("../services/dispute.service");

exports.open = async (req, res) => {
  const { orderId, reason } = req.body;

  await disputeService.openDispute(orderId, reason);

  res.json({ message: "Dispute opened" });
};