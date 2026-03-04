const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Season = sequelize.define('Season', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  season_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  monsoon_strength: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'completed'),
    defaultValue: 'active',
  },
}, {
  tableName: 'seasons',
  timestamps: false,
});

module.exports = Season;
