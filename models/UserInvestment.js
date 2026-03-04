const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

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
  product_type: {
    type: DataTypes.ENUM('sip', 'bond', 'farmer_bond'),
    allowNull: false,
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
