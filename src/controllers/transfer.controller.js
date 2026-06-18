const transferService = require("../services/transfer.service");
const { success, error } = require("../utils/apiResponse");

exports.transfer = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, amount, pin } = req.body;

    const result = await transferService.transferMoney(
      senderId,
      receiverId,
      amount,
      pin
    );

    return success(res, "Transfer successful", result);

  } catch (err) {
    return error(res, err.message);
  }
};