const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const UserProfile = sequelize.define('UserProfile', {
  user_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    references: {
      model: User,
      key: 'id',
    },
  },
  credit_trust: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
  fr_score: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
  stress_index: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  reputation_score: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
  digital_confidence: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  scam_awareness: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  smart_decision_rate: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
}, {
  tableName: 'user_profiles',
  timestamps: false,
});

module.exports = UserProfile;
