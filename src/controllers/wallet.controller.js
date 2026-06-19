const walletService = require("../services/wallet.service");

// GET WALLET
async function getWallet(req, res) {
  try {
    const wallet = await walletService.getWallet(req.user.userId);
    res.json(wallet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// DEPOSIT
async function deposit(req, res) {
  try {
    const { amount } = req.body;

    const result = await walletService.deposit(
      req.user.userId,
      Number(amount)
    );

    res.json({
      message: "Deposit successful",
      wallet: result,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// TRANSFER
async function transfer(req, res) {
  try {
    const { receiverId, amount } = req.body;

    const result = await walletService.transfer(
      req.user.userId,
      receiverId,
      Number(amount)
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  getWallet,
  deposit,
  transfer,
};