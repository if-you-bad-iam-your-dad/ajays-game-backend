const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const InvestmentProduct = require('./InvestmentProduct');

const UserInvestment = sequelize.define('UserInvestment', {
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
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: InvestmentProduct, key: 'id' },
  },
  invested_amount: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
  },
  current_value: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
  },
  maturity_date: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM('active', 'matured', 'withdrawn'),
    defaultValue: 'active',
  },
}, {
  tableName: 'user_investments',
  timestamps: false,
});

module.exports = UserInvestment;
