const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Inventory = sequelize.define('Inventory', {
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
  item_type: {
    type: DataTypes.ENUM('crop', 'product', 'raw_material'),
    allowNull: false,
  },
  item_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00,
  },
  quality: {
    type: DataTypes.STRING(50),
  },
}, {
  tableName: 'inventory',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Inventory;
