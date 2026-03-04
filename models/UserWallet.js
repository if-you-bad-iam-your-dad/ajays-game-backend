const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const UserWallet = sequelize.define('UserWallet', {
  user_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    references: {
      model: User,
      key: 'id',
    },
  },
  balance: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0,
    },
  },
  reserved_balance: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0,
    },
  },
}, {
  tableName: 'user_wallets',
  timestamps: false,
});

module.exports = UserWallet;
