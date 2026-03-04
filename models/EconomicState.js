const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EconomicState = sequelize.define('EconomicState', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  inflation_rate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 5.00,
  },
  monsoon_strength: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 1.00,
  },
  rural_credit_modifier: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 1.00,
  },
  fraud_index: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.05,
  },
}, {
  tableName: 'economic_state',
  underscored: true,
  timestamps: true,
  createdAt: false,
  updatedAt: 'updated_at',
});

module.exports = EconomicState;
