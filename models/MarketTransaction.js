const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const MarketListing = require('./MarketListing');

const MarketTransaction = sequelize.define('MarketTransaction', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  listing_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: MarketListing, key: 'id' },
  },
  buyer_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
  seller_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
  quantity: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  unit_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
  },
}, {
  tableName: 'market_transactions',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = MarketTransaction;
