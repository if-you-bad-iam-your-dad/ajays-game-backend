const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Land = require('./Land');
const Season = require('./Season');
const Crop = require('./Crop');
const Seed = require('./Seed');

const FarmPlan = sequelize.define('FarmPlan', {
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
  land_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: Land, key: 'id' },
  },
  season_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: Season, key: 'id' },
  },
  crop_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Crop, key: 'id' },
  },
  seed_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Seed, key: 'id' },
  },
  area_allocated: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  planned_yield: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  yield_factor: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 1.00,
  },
  status: {
    type: DataTypes.ENUM('planned', 'harvested', 'failed'),
    defaultValue: 'planned',
  },
}, {
  tableName: 'farm_plans',
  timestamps: false,
});

module.exports = FarmPlan;
