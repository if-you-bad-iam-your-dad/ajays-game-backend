const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Loan = require('./Loan');

const LoanInstallment = sequelize.define('LoanInstallment', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  loan_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: Loan, key: 'id' },
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  amount_due: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
  },
  paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'loan_installments',
  timestamps: false,
});

module.exports = LoanInstallment;
