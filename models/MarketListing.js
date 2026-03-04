const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const MarketListing = sequelize.define('MarketListing', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  seller_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
  item_type: {
    type: DataTypes.ENUM('crop', 'product'),
    allowNull: false,
  },
  item_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  remaining_qty: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  price_per_unit: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  sale_type: {
    type: DataTypes.ENUM('open', 'consignment'),
    defaultValue: 'open',
  },
  status: {
    type: DataTypes.ENUM('active', 'sold', 'cancelled'),
    defaultValue: 'active',
  },
}, {
  tableName: 'market_listings',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = MarketListing;
