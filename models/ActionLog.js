const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const ActionLog = sequelize.define('ActionLog', {
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
  action_type: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  metadata: {
    type: DataTypes.JSON,
  },
}, {
  tableName: 'action_logs',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = ActionLog;
