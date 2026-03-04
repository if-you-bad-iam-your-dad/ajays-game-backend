const { 
  InsurancePolicy, UserInvestment, SavingsGoal, Group, GroupMember, Budget, 
  Season, Crop, sequelize 
} = require('../models');
const walletService = require('./wallet.service');

class AdvancedService {
  /**
   * Buy insurance policy for a crop/season
   */
  async buyInsurance(userId, policyData) {
    const { cropId, seasonId, coverAmount, premium } = policyData;

    const t = await sequelize.transaction();

    try {
      // 1. Validate season midpoint
      const season = await Season.findByPk(seasonId);
      if (!season || season.status !== 'active') throw new Error('Season not active');
      
      // Simple logic: If current date is > 50% through season, block purchase
      const now = new Date();
      const start = new Date(season.start_time);
      const end = new Date(season.end_time);
      const midpoint = new Date(start.getTime() + (end.getTime() - start.getTime()) / 2);
      
      if (now > midpoint) {
        throw new Error('Insurance purchase window closed (Season midpoint passed)');
      }

      // 2. Deduct premium from wallet
      await walletService.addTransaction({
        userId,
        amount: -parseFloat(premium),
        txnType: 'INSURANCE_PREMIUM',
        transaction: t
      });

      // 3. Create Policy
      const policy = await InsurancePolicy.create({
        user_id: userId,
        crop_id: cropId,
        season_id: seasonId,
        cover_amount: coverAmount,
        premium: premium,
        status: 'active'
      }, { transaction: t });

      await t.commit();
      return policy;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Join a group (SHG/Co-op)
   */
  async joinGroup(userId, groupId) {
    return await GroupMember.create({
      user_id: userId,
      group_id: groupId
    });
  }

  /**
   * Set or update a budget
   */
  async setBudget(userId, budgetData) {
    const { category, allocatedAmount } = budgetData;
    
    let budget = await Budget.findOne({ where: { user_id: userId, category } });
    
    if (budget) {
      budget.allocated_amount = allocatedAmount;
      await budget.save();
    } else {
      budget = await Budget.create({
        user_id: userId,
        category,
        allocated_amount: allocatedAmount
      });
    }
    
    return budget;
  }

  /**
   * Create an investment (SIP/Bond)
   */
  async invest(userId, investData) {
    const { productType, amount, maturityDate } = investData;
    const amountFloat = parseFloat(amount);

    const t = await sequelize.transaction();

    try {
      await walletService.addTransaction({
        userId,
        amount: -amountFloat,
        txnType: 'INVESTMENT_PURCHASE',
        transaction: t
      });

      const investment = await UserInvestment.create({
        user_id: userId,
        product_type: productType,
        invested_amount: amountFloat,
        current_value: amountFloat,
        maturity_date: maturityDate,
        status: 'active'
      }, { transaction: t });

      await t.commit();
      return investment;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = new AdvancedService();
