const { Land, FarmPlan, Season, Crop, Seed, sequelize } = require('../models');

class AgriService {
  /**
   * Get all lands owned by a user
   */
  async getUserLands(userId) {
    return await Land.findAll({
      where: { user_id: userId }
    });
  }

  /**
   * Create a farm plan for a specific season
   */
  async createFarmPlan(userId, planData) {
    const { landId, seasonId, cropId, seedId, areaAllocated } = planData;

    const transaction = await sequelize.transaction();

    try {
      // 1. Validations
      const land = await Land.findByPk(landId);
      if (!land || land.user_id !== userId) throw new Error('Invalid land selection');

      const season = await Season.findByPk(seasonId);
      if (!season || season.status !== 'active') throw new Error('Season is not active or not found');

      const crop = await Crop.findByPk(cropId);
      if (!crop) throw new Error('Invalid crop selection');

      const seed = await Seed.findByPk(seedId);
      if (!seed || seed.crop_id !== parseInt(cropId)) throw new Error('Invalid seed for this crop');

      // 2. Check and handle existing plan for this land in this season
      const existingPlan = await FarmPlan.findOne({
        where: { land_id: landId, season_id: seasonId, status: 'planned' },
        transaction
      });
      
      if (existingPlan) {
        // Option A: Just update the existing plan (more efficient)
        // Option B: Delete and recreate (safer if associations or complex hooks involved)
        // We'll go with updating it.
        const plannedYield = parseFloat(crop.base_yield) * parseFloat(areaAllocated) * parseFloat(seed.yield_multiplier);
        
        existingPlan.crop_id = cropId;
        existingPlan.seed_id = seedId;
        existingPlan.area_allocated = areaAllocated;
        existingPlan.planned_yield = plannedYield;
        await existingPlan.save({ transaction });
        
        await transaction.commit();
        return existingPlan;
      }

      // 3. Calculate Planned Yield for NEW plan
      // Formula: planned_yield = crop.base_yield * areaAllocated * seed.yield_multiplier
      const plannedYield = parseFloat(crop.base_yield) * parseFloat(areaAllocated) * parseFloat(seed.yield_multiplier);

      // 4. Create NEW Plan
      const plan = await FarmPlan.create({
        user_id: userId,
        land_id: landId,
        season_id: seasonId,
        crop_id: cropId,
        seed_id: seedId,
        area_allocated: areaAllocated,
        planned_yield: plannedYield,
        status: 'planned'
      }, { transaction });

      await transaction.commit();
      return plan;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Get active season
   */
  async getActiveSeason() {
    return await Season.findOne({ where: { status: 'active' } });
  }
}

module.exports = new AgriService();
