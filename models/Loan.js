const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Loan = sequelize.define('Loan', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
  lender_type: {
    type: DataTypes.ENUM('formal', 'informal', 'shg', 'microfinance'),
    allowNull: false,
  },
  principal: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
  },
  interest_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  tenure_months: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  remaining_balance: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'defaulted'),
    defaultValue: 'active',
  },
}, {
  tableName: 'loans',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Loan;
