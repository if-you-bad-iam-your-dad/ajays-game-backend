const { Loan, LoanInstallment, UserProfile, UserWallet, sequelize } = require('../models');
const walletService = require('./wallet.service');

class LoanService {
  /**
   * Apply for a loan
   * Logic: Approval based on credit_trust score
   */
  async applyLoan(userId, loanData) {
    const { lenderType, principal, interestRate, tenureMonths } = loanData;
    const principalFloat = parseFloat(principal);

    const transaction = await sequelize.transaction();

    try {
      // 1. Check eligibility
      const profile = await UserProfile.findByPk(userId, { transaction });
      if (profile.credit_trust < 40) {
        throw new Error('Credit trust score too low for loan approval');
      }

      // 2. Check for existing active loans
      const activeLoan = await Loan.findOne({
        where: { user_id: userId, status: 'active' },
        transaction
      });
      if (activeLoan) {
        throw new Error('User already has an active loan');
      }

      // 3. Create Loan
      const loan = await Loan.create({
        user_id: userId,
        lender_type: lenderType,
        principal: principalFloat,
        interest_rate: interestRate,
        tenure_months: tenureMonths,
        remaining_balance: principalFloat, // Simplified: Principal + interest could be added here
        status: 'active'
      }, { transaction });

      // 4. Generate EMI Installments
      const emiAmount = (principalFloat * (1 + (parseFloat(interestRate) / 100))) / tenureMonths;
      const installments = [];
      const now = new Date();

      for (let i = 1; i <= tenureMonths; i++) {
        const dueDate = new Date(now);
        dueDate.setMonth(now.getMonth() + i);
        
        installments.push({
          loan_id: loan.id,
          due_date: dueDate,
          amount_due: emiAmount,
          paid: false
        });
      }

      await LoanInstallment.bulkCreate(installments, { transaction });

      // 5. Disburse funds to wallet
      await walletService.addTransaction({
        userId,
        amount: principalFloat,
        txnType: 'LOAN_DISBURSEMENT',
        referenceId: loan.id,
        transaction
      });

      await transaction.commit();
      return loan;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Repay a specific installment
   */
  async repayInstallment(userId, installmentId) {
    const t = await sequelize.transaction();

    try {
      const installment = await LoanInstallment.findByPk(installmentId, {
        include: [{ model: Loan, as: 'loan' }],
        transaction: t
      });

      if (!installment || installment.paid) throw new Error('Invalid or already paid installment');
      if (installment.loan.user_id !== userId) throw new Error('Unauthorized');

      // 1. Deduct from wallet
      await walletService.addTransaction({
        userId,
        amount: -parseFloat(installment.amount_due),
        txnType: 'LOAN_REPAYMENT',
        referenceId: installment.id,
        transaction: t
      });

      // 2. Mark installment as paid
      installment.paid = true;
      await installment.save({ transaction: t });

      // 3. Update Loan remaining balance
      const loan = installment.loan;
      loan.remaining_balance = parseFloat(loan.remaining_balance) - parseFloat(installment.amount_due);
      if (parseFloat(loan.remaining_balance) <= 0) {
        loan.status = 'completed';
      }
      await loan.save({ transaction: t });

      // 4. Boost Credit Trust
      const profile = await UserProfile.findByPk(userId, { transaction: t });
      profile.credit_trust = Math.min(100, profile.credit_trust + 1);
      await profile.save({ transaction: t });

      await t.commit();
      return { success: true, message: 'Installment repaid successfully' };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Get user loans
   */
  async getUserLoans(userId) {
    return await Loan.findAll({
      where: { user_id: userId },
      include: [{ model: LoanInstallment, as: 'installments' }]
    });
  }
}

module.exports = new LoanService();
