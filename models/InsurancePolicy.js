const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Crop = require('./Crop');
const Season = require('./Season');

const InsurancePolicy = sequelize.define('InsurancePolicy', {
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
  crop_id: {
    type: DataTypes.INTEGER,
    references: { model: Crop, key: 'id' },
  },
  season_id: {
    type: DataTypes.BIGINT,
    references: { model: Season, key: 'id' },
  },
  cover_amount: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
  },
  premium: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'claimed', 'expired'),
    defaultValue: 'active',
  },
}, {
  tableName: 'insurance_policies',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = InsurancePolicy;
