const { 
  User, Role, UserWallet, UserProfile, LoanInstallment, Loan, 
  SavingsGoal, UserInvestment, EconomicState, sequelize 
} = require('../models');
const walletService = require('./wallet.service');

class EngineService {
  /**
   * Monthly Financial Engine
   * Processes Salaries, EMIs, Savings, and Investments
   */
  async processMonthlyEngine() {
    const t = await sequelize.transaction();

    try {
      // 1. Credit Salaries (Mock logic based on Role)
      // Standard monthly credits for simulation
      const users = await User.findAll({ include: [{ model: Role, as: 'role' }], transaction: t });
      for (const user of users) {
        let salary = 0;
        if (user.role.role_key === 'young_adult') salary = 15000;
        if (user.role.role_key === 'student') salary = 1000; // Mock allowance
        
        if (salary > 0) {
          await walletService.addTransaction({
            userId: user.id,
            amount: salary,
            txnType: 'MONTHLY_SALARY',
            transaction: t
          });
        }
      }

      // 2. Process Auto-EMI for Loans
      const activeInstallments = await LoanInstallment.findAll({
        where: { paid: false },
        include: [{ model: Loan, as: 'loan' }],
        transaction: t
      });

      for (const inst of activeInstallments) {
        const wallet = await UserWallet.findOne({ where: { user_id: inst.loan.user_id }, transaction: t });
        if (parseFloat(wallet.balance) >= parseFloat(inst.amount_due)) {
          // Process payment
          await walletService.addTransaction({
            userId: inst.loan.user_id,
            amount: -parseFloat(inst.amount_due),
            txnType: 'EMI_AUTO_DEBIT',
            referenceId: inst.id,
            transaction: t
          });
          inst.paid = true;
          await inst.save({ transaction: t });
          
          // Update Loan
          const loan = inst.loan;
          loan.remaining_balance = parseFloat(loan.remaining_balance) - parseFloat(inst.amount_due);
          if (parseFloat(loan.remaining_balance) <= 0) loan.status = 'completed';
          await loan.save({ transaction: t });
        } else {
          // Penalize if balance is low (Stress Increase)
          const profile = await UserProfile.findByPk(inst.loan.user_id, { transaction: t });
          profile.stress_index = Math.min(100, profile.stress_index + 10);
          profile.credit_trust = Math.max(0, profile.credit_trust - 5);
          await profile.save({ transaction: t });
        }
      }

      // 3. Process Savings Goal Autopay (mock logic)
      const activeSavings = await SavingsGoal.findAll({ where: { status: 'active' }, transaction: t });
      for (const goal of activeSavings) {
        const autopayAmount = 500.00; // Mock fixed monthly save
        const wallet = await UserWallet.findOne({ where: { user_id: goal.user_id }, transaction: t });
        if (parseFloat(wallet.balance) >= autopayAmount) {
           await walletService.addTransaction({
            userId: goal.user_id,
            amount: -autopayAmount,
            txnType: 'SAVINGS_GOAL_CONTRIBUTION',
            referenceId: goal.id,
            transaction: t
          });
          goal.current_saved = parseFloat(goal.current_saved) + autopayAmount;
          if (parseFloat(goal.current_saved) >= parseFloat(goal.goal_amount)) goal.status = 'achieved';
          await goal.save({ transaction: t });
        }
      }

      // 4. Investment Compounding (Mock 1% monthly return)
      const investments = await UserInvestment.findAll({ where: { status: 'active' }, transaction: t });
      for (const inv of investments) {
        const oldVal = parseFloat(inv.current_value);
        inv.current_value = oldVal * 1.01;
        await inv.save({ transaction: t });
      }

      await t.commit();
      return { success: true, message: 'Monthly engine processed successfully' };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Daily Micro Engine
   * Passive Stress Decay & Reputation Growth
   */
  async processDailyEngine() {
    const t = await sequelize.transaction();

    try {
      const profiles = await UserProfile.findAll({ transaction: t });
      for (const profile of profiles) {
        // Stress slowly decays if low
        if (profile.stress_index > 0) {
          profile.stress_index = Math.max(0, profile.stress_index - 1);
        }
        await profile.save({ transaction: t });
      }

      await t.commit();
      return { success: true, message: 'Daily engine processed successfully' };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Global Event Engine
   * Randomizes Economic state (Inflation, Monsoon)
   */
  async processGlobalEvents() {
    const state = await EconomicState.findByPk(1);
    if (state) {
      state.inflation_rate = (4 + Math.random() * 4).toFixed(2); // 4% to 8%
      state.monsoon_strength = (0.7 + Math.random() * 0.6).toFixed(2); // 0.7 to 1.3
      await state.save();
    }
    return state;
  }
}

module.exports = new EngineService();
