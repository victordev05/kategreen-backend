const deliveryService = require("../services/delivery.service");

// UPDATE DELIVERY (LOGISTICS)
async function update(req, res) {
  try {
    const { deliveryId, status, proofUrl, notes } = req.body;

    const delivery = await deliveryService.updateDeliveryStatus(
      deliveryId,
      status,
      proofUrl,
      notes
    );

    res.json(delivery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// CONFIRM DELIVERY (BUYER)
async function confirm(req, res) {
  try {
    const { orderId } = req.body;

    const result = await deliveryService.confirmDelivery(orderId);

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  update,
  confirm,
};