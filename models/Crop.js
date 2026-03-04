const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Crop = sequelize.define('Crop', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  base_yield: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  base_market_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  risk_category: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: false,
  },
}, {
  tableName: 'crops',
  timestamps: false,
});

module.exports = Crop;
