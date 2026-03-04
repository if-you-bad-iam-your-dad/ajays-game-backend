const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Land = sequelize.define('Land', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  total_area: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  soil_quality: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: false,
  },
  irrigation_level: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'lands',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Land;
