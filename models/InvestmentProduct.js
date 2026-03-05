const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InvestmentProduct = sequelize.define('InvestmentProduct', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_type: {
    type: DataTypes.ENUM('sip', 'bond', 'farmer_bond'),
    allowNull: false,
  },
  base_return_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  volatility: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
}, {
  tableName: 'investment_products',
  timestamps: false,
});

module.exports = InvestmentProduct;
