const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Group = require('./Group');

const GroupMember = sequelize.define('GroupMember', {
  group_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    references: { model: Group, key: 'id' },
  },
  user_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    references: { model: User, key: 'id' },
  },
}, {
  tableName: 'group_members',
  underscored: true,
  timestamps: true,
  createdAt: 'joined_at',
  updatedAt: false,
});

module.exports = GroupMember;
