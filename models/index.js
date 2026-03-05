const { sequelize } = require('../config/database');
const Role = require('./Role');
const User = require('./User');
const UserProfile = require('./UserProfile');
const UserWallet = require('./UserWallet');
const WalletTransaction = require('./WalletTransaction');
const Season = require('./Season');
const Land = require('./Land');
const Crop = require('./Crop');
const Seed = require('./Seed');
const FarmPlan = require('./FarmPlan');
const Inventory = require('./Inventory');
const MarketListing = require('./MarketListing');
const MarketTransaction = require('./MarketTransaction');
const Loan = require('./Loan');
const LoanInstallment = require('./LoanInstallment');
const IdempotencyKey = require('./IdempotencyKey');
const EconomicState = require('./EconomicState');
const ActionLog = require('./ActionLog');
const SavingsGoal = require('./SavingsGoal');
const UserInvestment = require('./UserInvestment');
const InvestmentProduct = require('./InvestmentProduct');
const InsurancePolicy = require('./InsurancePolicy');
const Group = require('./Group');
const GroupMember = require('./GroupMember');
const Budget = require('./Budget');

// User <-> Role
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(User, { foreignKey: 'role_id' });

// User <-> Profile
User.hasOne(UserProfile, { foreignKey: 'user_id', as: 'profile' });
UserProfile.belongsTo(User, { foreignKey: 'user_id' });

// User <-> Wallet
User.hasOne(UserWallet, { foreignKey: 'user_id', as: 'wallet' });
UserWallet.belongsTo(User, { foreignKey: 'user_id' });

// User <-> WalletTransaction
User.hasMany(WalletTransaction, { foreignKey: 'user_id', as: 'transactions' });
WalletTransaction.belongsTo(User, { foreignKey: 'user_id' });

// User <-> Land
User.hasMany(Land, { foreignKey: 'user_id', as: 'lands' });
Land.belongsTo(User, { foreignKey: 'user_id' });

// Crop <-> Seed
Crop.hasMany(Seed, { foreignKey: 'crop_id', as: 'seeds' });
Seed.belongsTo(Crop, { foreignKey: 'crop_id', as: 'crop' });

// FarmPlan Associations
FarmPlan.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
FarmPlan.belongsTo(Land, { foreignKey: 'land_id', as: 'land' });
FarmPlan.belongsTo(Season, { foreignKey: 'season_id', as: 'season' });
FarmPlan.belongsTo(Crop, { foreignKey: 'crop_id', as: 'crop' });
FarmPlan.belongsTo(Seed, { foreignKey: 'seed_id', as: 'seed' });

// User <-> Inventory
User.hasMany(Inventory, { foreignKey: 'user_id', as: 'inventories' });
Inventory.belongsTo(User, { foreignKey: 'user_id' });

// MarketListing Associations
MarketListing.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });
User.hasMany(MarketListing, { foreignKey: 'seller_id', as: 'listings' });

// MarketTransaction Associations
MarketTransaction.belongsTo(MarketListing, { foreignKey: 'listing_id', as: 'listing' });
MarketTransaction.belongsTo(User, { foreignKey: 'buyer_id', as: 'buyer' });
MarketTransaction.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });

// Loan Associations
Loan.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Loan, { foreignKey: 'user_id', as: 'loans' });
Loan.hasMany(LoanInstallment, { foreignKey: 'loan_id', as: 'installments' });
LoanInstallment.belongsTo(Loan, { foreignKey: 'loan_id', as: 'loan' });

// Savings & Investment
User.hasMany(SavingsGoal, { foreignKey: 'user_id', as: 'savingsGoals' });
SavingsGoal.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(UserInvestment, { foreignKey: 'user_id', as: 'investments' });
UserInvestment.belongsTo(User, { foreignKey: 'user_id' });
UserInvestment.belongsTo(InvestmentProduct, { foreignKey: 'product_id', as: 'product' });
InvestmentProduct.hasMany(UserInvestment, { foreignKey: 'product_id' });

// Insurance
User.hasMany(InsurancePolicy, { foreignKey: 'user_id', as: 'policies' });
InsurancePolicy.belongsTo(User, { foreignKey: 'user_id' });
InsurancePolicy.belongsTo(Crop, { foreignKey: 'crop_id', as: 'crop' });
InsurancePolicy.belongsTo(Season, { foreignKey: 'season_id', as: 'season' });

// Groups
Group.belongsToMany(User, { through: GroupMember, foreignKey: 'group_id', as: 'members' });
User.belongsToMany(Group, { through: GroupMember, foreignKey: 'user_id', as: 'groups' });

// Budgets
User.hasMany(Budget, { foreignKey: 'user_id', as: 'budgets' });
Budget.belongsTo(User, { foreignKey: 'user_id' });

// System Associations
IdempotencyKey.belongsTo(User, { foreignKey: 'user_id' });
ActionLog.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Role,
  User,
  UserProfile,
  UserWallet,
  WalletTransaction,
  Season,
  Land,
  Crop,
  Seed,
  FarmPlan,
  Inventory,
  MarketListing,
  MarketTransaction,
  Loan,
  LoanInstallment,
  IdempotencyKey,
  EconomicState,
  ActionLog,
  SavingsGoal,
  UserInvestment,
  InvestmentProduct,
  InsurancePolicy,
  Group,
  GroupMember,
  Budget,
};
