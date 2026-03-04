const walletService = require('../services/wallet.service');

exports.getWallet = async (req, res) => {
  try {
    const wallet = await walletService.getWallet(req.user.id);
    res.status(200).json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { code: 'WALLET_FETCH_FAILED', message: error.message },
    });
  }
};

exports.transferFunds = async (req, res) => {
  try {
    const { recipientId, amount, reason } = req.body;
    const result = await walletService.transferFunds({
      senderId: req.user.id,
      recipientId,
      amount,
      reason,
    });
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { code: 'TRANSFER_FAILED', message: error.message },
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await walletService.getTransactions(req.user.id, { page, limit });
    res.status(200).json({
      success: true,
      data: result.transactions,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { code: 'TRANSACTIONS_FETCH_FAILED', message: error.message },
    });
  }
};
