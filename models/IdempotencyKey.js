const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const IdempotencyKey = sequelize.define('IdempotencyKey', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  idempotency_key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
  request_path: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  response_code: {
    type: DataTypes.INTEGER,
  },
  response_body: {
    type: DataTypes.JSON,
  },
}, {
  tableName: 'idempotency_keys',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = IdempotencyKey;
