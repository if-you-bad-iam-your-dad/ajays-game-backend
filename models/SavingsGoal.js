const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const SavingsGoal = sequelize.define('SavingsGoal', {
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
  goal_amount: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
  },
  current_saved: {
    type: DataTypes.DECIMAL(14, 2),
    defaultValue: 0.00,
  },
  deadline: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM('active', 'achieved', 'failed'),
    defaultValue: 'active',
  },
}, {
  tableName: 'savings_goals',
  timestamps: false,
});

module.exports = SavingsGoal;
