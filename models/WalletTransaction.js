const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const WalletTransaction = sequelize.define('WalletTransaction', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  txn_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  reference_id: {
    type: DataTypes.BIGINT,
  },
  amount: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
  },
  balance_before: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
  },
  balance_after: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
  },
}, {
  tableName: 'wallet_transactions',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = WalletTransaction;
