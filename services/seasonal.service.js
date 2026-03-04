const { Season, FarmPlan, Inventory, UserProfile, UserWallet, WalletTransaction, sequelize } = require('../models');

class SeasonalService {
  /**
   * Resolve all farm plans for a finished season
   */
  async resolveSeason(seasonId) {
    const season = await Season.findByPk(seasonId);
    if (!season || season.status !== 'active') {
      throw new Error('Season not found or already completed');
    }

    const plans = await FarmPlan.findAll({
      where: { season_id: seasonId, status: 'planned' }
    });

    const results = [];

    for (const plan of plans) {
      const result = await this.processHarvest(plan, season.monsoon_strength);
      results.push(result);
    }

    // Mark season as completed
    season.status = 'completed';
    await season.save();

    return results;
  }

  /**
   * Process harvest for a single plan
   * Logic: finalYield = plannedYield * monsoonStrength * yieldFactor
   */
  async processHarvest(plan, monsoonStrength) {
    const t = await sequelize.transaction();

    try {
      const finalYield = parseFloat(plan.planned_yield) * parseFloat(monsoonStrength) * parseFloat(plan.yield_factor);

      // 1. Update Plan status
      plan.status = 'harvested';
      await plan.save({ transaction: t });

      // 2. Add to Inventory
      let inventory = await Inventory.findOne({
        where: { user_id: plan.user_id, item_type: 'crop', item_id: plan.crop_id },
        transaction: t
      });

      if (inventory) {
        inventory.quantity = parseFloat(inventory.quantity) + finalYield;
        await inventory.save({ transaction: t });
      } else {
        await Inventory.create({
          user_id: plan.user_id,
          item_type: 'crop',
          item_id: plan.crop_id,
          quantity: finalYield,
          quality: 'Standard'
        }, { transaction: t });
      }

      // 3. Update User Reputation
      const profile = await UserProfile.findByPk(plan.user_id, { transaction: t });
      if (profile) {
        profile.reputation_score = Math.min(100, profile.reputation_score + 2);
        await profile.save({ transaction: t });
      }

      await t.commit();
      return { planId: plan.id, userId: plan.user_id, finalYield };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = new SeasonalService();
