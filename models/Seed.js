const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Crop = require('./Crop');

const Seed = sequelize.define('Seed', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  crop_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Crop,
      key: 'id',
    },
  },
  quality: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: false,
  },
  yield_multiplier: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  cost_per_unit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'seeds',
  timestamps: false,
});

module.exports = Seed;
