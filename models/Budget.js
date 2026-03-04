const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Budget = sequelize.define('Budget', {
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
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  allocated_amount: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
  },
  period: {
    type: DataTypes.ENUM('monthly'),
    defaultValue: 'monthly',
  },
}, {
  tableName: 'budgets',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Budget;
