const orderService = require("../services/order.service");

// CREATE ORDER
async function create(req, res) {
  try {
    const order = await orderService.createOrder({
      buyerId: req.user.userId,
      ...req.body,
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
}

module.exports = {
  create,
};