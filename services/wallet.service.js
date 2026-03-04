const { UserWallet, WalletTransaction, sequelize } = require('../models');

class WalletService {
  /**
   * Get wallet balance for a user
   */
  async getWallet(userId) {
    const wallet = await UserWallet.findOne({ where: { user_id: userId } });
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    return wallet;
  }

  /**
   * Internal method to process a transaction with audit trail
   */
  async addTransaction({ userId, amount, txnType, referenceId, transaction }) {
    const wallet = await UserWallet.findOne({
      where: { user_id: userId },
      lock: transaction.LOCK.UPDATE,
      transaction
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const balanceBefore = parseFloat(wallet.balance);
    const amountFloat = parseFloat(amount);
    const balanceAfter = balanceBefore + amountFloat;

    if (balanceAfter < 0) {
      throw new Error('Insufficient funds');
    }

    // Update wallet balance
    wallet.balance = balanceAfter;
    await wallet.save({ transaction });

    // Create audit log
    await WalletTransaction.create({
      user_id: userId,
      txn_type: txnType,
      reference_id: referenceId,
      amount: amountFloat,
      balance_before: balanceBefore,
      balance_after: balanceAfter
    }, { transaction });

    return wallet;
  }

  /**
   * Transfer funds from one user to another
   */
  async transferFunds({ senderId, recipientId, amount, reason }) {
    if (senderId === recipientId) {
      throw new Error('Cannot transfer to yourself');
    }

    const amountFloat = parseFloat(amount);
    if (amountFloat <= 0) {
      throw new Error('Invalid transfer amount');
    }

    const t = await sequelize.transaction();

    try {
      // Debit sender
      await this.addTransaction({
        userId: senderId,
        amount: -amountFloat,
        txnType: 'TRANSFER_OUT',
        referenceId: recipientId,
        transaction: t
      });

      // Credit recipient
      await this.addTransaction({
        userId: recipientId,
        amount: amountFloat,
        txnType: 'TRANSFER_IN',
        referenceId: senderId,
        transaction: t
      });

      await t.commit();
      return { success: true, message: 'Transfer successful' };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Get transaction history for a user
   */
  async getTransactions(userId, { page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const { count, rows } = await WalletTransaction.findAndCountAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return {
      transactions: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    };
  }
}

module.exports = new WalletService();
