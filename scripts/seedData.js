const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const { 
  sequelize, User, Role, UserProfile, UserWallet, Crop, Seed, 
  Season, Group, GroupMember, Land, Inventory, MarketListing, 
  Loan, LoanInstallment, EconomicState 
} = require('../models');

async function seed() {
  console.log('--- Starting Database Seeding ---');
  
  try {
    // 1. Sync and Clear
    // Caution: This forces sync, which drops tables. Better to just truncate if tables exist.
    // For a seed script, we'll assume tables exist and just clear them.
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await User.destroy({ where: {}, truncate: true });
    await Role.destroy({ where: {}, truncate: true });
    await UserProfile.destroy({ where: {}, truncate: true });
    await UserWallet.destroy({ where: {}, truncate: true });
    await Crop.destroy({ where: {}, truncate: true });
    await Seed.destroy({ where: {}, truncate: true });
    await Season.destroy({ where: {}, truncate: true });
    await Group.destroy({ where: {}, truncate: true });
    await Land.destroy({ where: {}, truncate: true });
    await Inventory.destroy({ where: {}, truncate: true });
    await MarketListing.destroy({ where: {}, truncate: true });
    await Loan.destroy({ where: {}, truncate: true });
    await LoanInstallment.destroy({ where: {}, truncate: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('✓ Tables cleared');

    // 2. Seed Roles
    await Role.bulkCreate([
      { id: 1, role_key: 'farmer', description: 'Agricultural producer' },
      { id: 2, role_key: 'woman', description: 'Small business owner' },
      { id: 3, role_key: 'student', description: 'Young learner' },
      { id: 4, role_key: 'young_adult', description: 'Salaried professional' },
    ]);
    console.log('✓ Roles seeded');

    // 3. Seed Crops & Seeds
    const wheat = await Crop.create({ id: 1, name: 'Wheat', base_yield: 100, base_market_price: 20, risk_category: 'low' });
    const rice = await Crop.create({ id: 2, name: 'Rice', base_yield: 150, base_market_price: 25, risk_category: 'medium' });
    
    await Seed.bulkCreate([
      { id: 1, crop_id: 1, quality: 'low', yield_multiplier: 0.8, cost_per_unit: 5 },
      { id: 2, crop_id: 1, quality: 'medium', yield_multiplier: 1.0, cost_per_unit: 8 },
      { id: 3, crop_id: 2, quality: 'medium', yield_multiplier: 1.0, cost_per_unit: 10 },
    ]);
    console.log('✓ Crops and Seeds seeded');

    // 4. Seed Season
    await Season.create({
      id: 1,
      season_number: 1,
      start_time: new Date('2026-01-01'),
      end_time: new Date('2026-06-30'),
      monsoon_strength: 1.1,
      status: 'active'
    });
    console.log('✓ Season seeded');

    // 5. Seed Users (Password: password123)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.bulkCreate([
      { id: 1, username: 'farmer_joe', email: 'farmer@test.com', password_hash: hashedPassword, role_id: 1 },
      { id: 2, username: 'woman_jane', email: 'woman@test.com', password_hash: hashedPassword, role_id: 2 },
      { id: 3, username: 'student_sam', email: 'student@test.com', password_hash: hashedPassword, role_id: 3 },
      { id: 4, username: 'adult_alex', email: 'adult@test.com', password_hash: hashedPassword, role_id: 4 },
    ]);

    // Profiles
    await UserProfile.bulkCreate([
      { user_id: 1, credit_trust: 70, fr_score: 60, reputation_score: 80 },
      { user_id: 2, credit_trust: 85, fr_score: 90, reputation_score: 95 },
      { user_id: 3, credit_trust: 50, fr_score: 50, reputation_score: 50 },
      { user_id: 4, credit_trust: 60, fr_score: 70, reputation_score: 65 },
    ]);

    // Wallets
    await UserWallet.bulkCreate([
      { user_id: 1, balance: 5000 },
      { user_id: 2, balance: 2500 },
      { user_id: 3, balance: 500 },
      { user_id: 4, balance: 15000 },
    ]);
    console.log('✓ Users, Profiles, and Wallets seeded');

    // 6. Lands & Inventory
    await Land.create({ user_id: 1, total_area: 10.5, soil_quality: 'high', irrigation_level: 2 });
    await Inventory.create({ user_id: 1, item_type: 'crop', item_id: 1, quantity: 500, quality: 'Premium' });
    console.log('✓ Lands and Inventory seeded');

    // 7. Groups
    const group = await Group.create({ id: 1, name: 'Green Valley SHG', group_type: 'shg' });
    await GroupMember.create({ group_id: group.id, user_id: 2 });
    console.log('✓ Groups seeded');

    // 8. Economic State
    await EconomicState.upsert({ id: 1, inflation_rate: 5.5, monsoon_strength: 1.1, rural_credit_modifier: 1.0, fraud_index: 0.05 });
    console.log('✓ Economic State updated');

    console.log('--- Seeding Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
