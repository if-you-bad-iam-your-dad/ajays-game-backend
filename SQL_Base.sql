-- ============================================================
-- FINLIT DATABASE SETUP GUIDE
-- ============================================================
-- Follow these steps to set up the database:
--
-- 1. Open your terminal or Command Prompt.
-- 2. Log in to your MySQL server:
--    mysql -u root -p
--
-- 3. Run this initialization script:
--    SOURCE D:/Projects Development/FinLit/backend/SQL_Base.sql;
--
-- 4. Verify the database creation:
--    SHOW DATABASES;
--    USE finlit_db;
--    SHOW TABLES;
--
-- 5. Your database is now ready for the backend connection.
-- ============================================================

-- FinLit Database Initialization Script
-- Based on DATABASE_SCHEMA.md

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Create Database
-- ----------------------------
CREATE DATABASE IF NOT EXISTS finlit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE finlit_db;

-- ----------------------------
-- Table structure for roles
-- ----------------------------
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role_key` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Seed data for roles
-- ----------------------------
INSERT INTO `roles` (`role_key`, `description`) VALUES 
('farmer', 'Agricultural producer focused on crop management and market trading.'),
('woman', 'Small business owner and household budget manager.'),
('student', 'Young learner focused on allowance management and micro-investing.'),
('young_adult', 'Enterprise manager and salaried professional.');

-- ----------------------------
-- Table structure for users
-- ----------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role_id` INT NOT NULL,
  `status` ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for user_profiles
-- ----------------------------
CREATE TABLE IF NOT EXISTS `user_profiles` (
  `user_id` BIGINT NOT NULL,
  `credit_trust` INT DEFAULT 50,
  `fr_score` INT DEFAULT 50,
  `stress_index` INT DEFAULT 0,
  `reputation_score` INT DEFAULT 50,
  `digital_confidence` INT DEFAULT 0,
  `scam_awareness` INT DEFAULT 0,
  `smart_decision_rate` INT DEFAULT 50,
  `liquid_assets` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `investment_value` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for user_wallets
-- ----------------------------
CREATE TABLE IF NOT EXISTS `user_wallets` (
  `user_id` BIGINT NOT NULL,
  `balance` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `reserved_balance` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `check_positive_balance` CHECK (balance >= 0),
  CONSTRAINT `fk_wallet_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for idempotency_keys
-- ----------------------------
CREATE TABLE IF NOT EXISTS `idempotency_keys` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `idempotency_key` VARCHAR(100) NOT NULL UNIQUE,
  `user_id` BIGINT NOT NULL,
  `request_path` VARCHAR(255) NOT NULL,
  `response_code` INT DEFAULT NULL,
  `response_body` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_idempotency_user_id` (`user_id`),
  CONSTRAINT `fk_idempotency_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for wallet_transactions
-- ----------------------------
CREATE TABLE IF NOT EXISTS `wallet_transactions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `txn_type` VARCHAR(50) NOT NULL,
  `reference_id` BIGINT DEFAULT NULL,
  `amount` DECIMAL(14,2) NOT NULL,
  `balance_before` DECIMAL(14,2) NOT NULL,
  `balance_after` DECIMAL(14,2) NOT NULL,
  `reason_code` VARCHAR(50) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_wallet_user_id` (`user_id`),
  CONSTRAINT `fk_txn_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for lands
-- ----------------------------
CREATE TABLE IF NOT EXISTS `lands` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `total_area` DECIMAL(10,2) NOT NULL,
  `soil_quality` ENUM('low', 'medium', 'high') NOT NULL,
  `irrigation_level` INT DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_land_user_id` (`user_id`),
  CONSTRAINT `fk_land_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for crops
-- ----------------------------
CREATE TABLE IF NOT EXISTS `crops` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `base_yield` DECIMAL(10,2) NOT NULL,
  `base_market_price` DECIMAL(10,2) NOT NULL,
  `risk_category` ENUM('low', 'medium', 'high') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for seeds
-- ----------------------------
CREATE TABLE IF NOT EXISTS `seeds` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `crop_id` INT NOT NULL,
  `quality` ENUM('low', 'medium', 'high') NOT NULL,
  `yield_multiplier` DECIMAL(5,2) NOT NULL,
  `cost_per_unit` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_seed_crop` FOREIGN KEY (`crop_id`) REFERENCES `crops` (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for seasons
-- ----------------------------
CREATE TABLE IF NOT EXISTS `seasons` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `season_number` INT NOT NULL,
  `start_time` DATETIME NOT NULL,
  `end_time` DATETIME NOT NULL,
  `monsoon_strength` DECIMAL(5,2) NOT NULL,
  `status` ENUM('active', 'completed') DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for farm_plans
-- ----------------------------
CREATE TABLE IF NOT EXISTS `farm_plans` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `land_id` BIGINT NOT NULL,
  `season_id` BIGINT NOT NULL,
  `crop_id` INT NOT NULL,
  `seed_id` INT NOT NULL,
  `area_allocated` DECIMAL(10,2) NOT NULL,
  `planned_yield` DECIMAL(12,2) NOT NULL,
  `yield_factor` DECIMAL(5,2) DEFAULT 1.00,
  `status` ENUM('planned', 'harvested', 'failed') DEFAULT 'planned',
  PRIMARY KEY (`id`),
  KEY `idx_farm_user_id` (`user_id`),
  KEY `idx_farm_season_id` (`season_id`),
  CONSTRAINT `fk_farm_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_farm_land` FOREIGN KEY (`land_id`) REFERENCES `lands` (`id`),
  CONSTRAINT `fk_farm_season` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`),
  CONSTRAINT `fk_farm_crop` FOREIGN KEY (`crop_id`) REFERENCES `crops` (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for inventory
-- ----------------------------
CREATE TABLE IF NOT EXISTS `inventory` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `item_type` ENUM('crop', 'product', 'raw_material') NOT NULL,
  `item_id` BIGINT NOT NULL,
  `quantity` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `quality` VARCHAR(50) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `idempotency_key` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_inventory_user_item` (`user_id`, `item_type`),
  CONSTRAINT `fk_inv_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for market_listings
-- ----------------------------
CREATE TABLE IF NOT EXISTS `market_listings` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `seller_id` BIGINT NOT NULL,
  `item_type` ENUM('crop', 'product') NOT NULL,
  `item_id` BIGINT NOT NULL,
  `quantity` DECIMAL(12,2) NOT NULL,
  `remaining_qty` DECIMAL(12,2) NOT NULL,
  `price_per_unit` DECIMAL(12,2) NOT NULL,
  `sale_type` ENUM('open', 'consignment') DEFAULT 'open',
  `status` ENUM('active', 'sold', 'cancelled') DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_market_seller_id` (`seller_id`),
  CONSTRAINT `fk_market_seller` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for market_transactions
-- ----------------------------
CREATE TABLE IF NOT EXISTS `market_transactions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `listing_id` BIGINT NOT NULL,
  `buyer_id` BIGINT NOT NULL,
  `seller_id` BIGINT NOT NULL,
  `quantity` DECIMAL(12,2) NOT NULL,
  `unit_price` DECIMAL(12,2) NOT NULL,
  `total_amount` DECIMAL(14,2) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_mt_listing_id` (`listing_id`),
  KEY `idx_mt_buyer_id` (`buyer_id`),
  KEY `idx_mt_seller_id` (`seller_id`),
  CONSTRAINT `fk_mt_listing` FOREIGN KEY (`listing_id`) REFERENCES `market_listings` (`id`),
  CONSTRAINT `fk_mt_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_mt_seller` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for loans
-- ----------------------------
CREATE TABLE IF NOT EXISTS `loans` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `lender_type` ENUM('formal', 'informal', 'shg', 'microfinance') NOT NULL,
  `principal` DECIMAL(14,2) NOT NULL,
  `interest_rate` DECIMAL(5,2) NOT NULL,
  `tenure_months` INT NOT NULL,
  `remaining_balance` DECIMAL(14,2) NOT NULL,
  `status` ENUM('active', 'completed', 'defaulted') DEFAULT 'active',
  `default_count` INT DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_loan_user_id` (`user_id`),
  CONSTRAINT `fk_loan_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for loan_installments
-- ----------------------------
CREATE TABLE IF NOT EXISTS `loan_installments` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `loan_id` BIGINT NOT NULL,
  `due_date` DATETIME NOT NULL,
  `amount_due` DECIMAL(14,2) NOT NULL,
  `paid` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`id`),
  KEY `idx_li_loan_id` (`loan_id`),
  KEY `idx_li_due_date` (`due_date`),
  CONSTRAINT `fk_li_loan` FOREIGN KEY (`loan_id`) REFERENCES `loans` (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for insurance_policies
-- ----------------------------
CREATE TABLE IF NOT EXISTS `insurance_policies` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `crop_id` INT DEFAULT NULL,
  `season_id` BIGINT DEFAULT NULL,
  `cover_amount` DECIMAL(14,2) NOT NULL,
  `premium` DECIMAL(14,2) NOT NULL,
  `status` ENUM('active', 'claimed', 'expired') DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ins_user_id` (`user_id`),
  CONSTRAINT `fk_ins_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_ins_crop` FOREIGN KEY (`crop_id`) REFERENCES `crops` (`id`),
  CONSTRAINT `fk_ins_season` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for investment_products
-- ----------------------------
CREATE TABLE IF NOT EXISTS `investment_products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_type` ENUM('sip', 'bond', 'farmer_bond') NOT NULL,
  `base_return_rate` DECIMAL(5,2) NOT NULL,
  `volatility` DECIMAL(5,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for user_investments
-- ----------------------------
CREATE TABLE IF NOT EXISTS `user_investments` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `product_id` INT NOT NULL,
  `invested_amount` DECIMAL(14,2) NOT NULL,
  `current_value` DECIMAL(14,2) NOT NULL,
  `maturity_date` DATETIME NOT NULL,
  `status` ENUM('active', 'matured', 'withdrawn') DEFAULT 'active',
  PRIMARY KEY (`id`),
  KEY `idx_inv_user_id` (`user_id`),
  KEY `idx_inv_maturity_date` (`maturity_date`),
  CONSTRAINT `fk_inv_prod_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_inv_product` FOREIGN KEY (`product_id`) REFERENCES `investment_products` (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for savings_goals
-- ----------------------------
CREATE TABLE IF NOT EXISTS `savings_goals` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `goal_amount` DECIMAL(14,2) NOT NULL,
  `deadline` DATETIME NOT NULL,
  `current_saved` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('active', 'achieved', 'failed') DEFAULT 'active',
  PRIMARY KEY (`id`),
  KEY `idx_sg_user_id` (`user_id`),
  CONSTRAINT `fk_sg_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for groups
-- ----------------------------
CREATE TABLE IF NOT EXISTS `groups` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `group_type` ENUM('shg', 'coop') NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for group_members
-- ----------------------------
CREATE TABLE IF NOT EXISTS `group_members` (
  `group_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `joined_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`group_id`, `user_id`),
  CONSTRAINT `fk_gm_group` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`),
  CONSTRAINT `fk_gm_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for budgets
-- ----------------------------
CREATE TABLE IF NOT EXISTS `budgets` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `allocated_amount` DECIMAL(14,2) NOT NULL,
  `period` ENUM('monthly') DEFAULT 'monthly',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_budget_user_id` (`user_id`),
  CONSTRAINT `fk_budget_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for fraud_events
-- ----------------------------
CREATE TABLE IF NOT EXISTS `fraud_events` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `event_type` VARCHAR(100) NOT NULL,
  `loss_amount` DECIMAL(14,2) NOT NULL,
  `resolved` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_fraud_user_id` (`user_id`),
  CONSTRAINT `fk_fraud_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for economic_state
-- ----------------------------
CREATE TABLE IF NOT EXISTS `economic_state` (
  `id` INT NOT NULL,
  `inflation_rate` DECIMAL(5,2) NOT NULL DEFAULT 5.00,
  `monsoon_strength` DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  `rural_credit_modifier` DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  `fraud_index` DECIMAL(5,2) NOT NULL DEFAULT 0.05,
  `agri_subsidy_modifier` DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  `investment_market_volatility` DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  `digital_fraud_index` DECIMAL(5,2) NOT NULL DEFAULT 0.05,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for commodity_indices
-- ----------------------------
CREATE TABLE IF NOT EXISTS `commodity_indices` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `commodity_type` ENUM('crop', 'product') NOT NULL,
  `item_id` BIGINT NOT NULL,
  `supply_index` DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  `demand_index` DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_commodity_item` (`commodity_type`, `item_id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for enterprises
-- ----------------------------
CREATE TABLE IF NOT EXISTS `enterprises` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `enterprise_type` VARCHAR(50) NOT NULL,
  `revenue` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `costs` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `tax_due` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `inventory_value` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('active', 'bankrupt', 'closed') DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ent_user_id` (`user_id`),
  CONSTRAINT `fk_ent_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table structure for allowance_schedules
-- ----------------------------
CREATE TABLE IF NOT EXISTS `allowance_schedules` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `amount` DECIMAL(14,2) NOT NULL,
  `frequency` ENUM('monthly', 'weekly') DEFAULT 'monthly',
  `next_credit_date` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_allowance_user_id` (`user_id`),
  CONSTRAINT `fk_allowance_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Seed data for economic_state
-- ----------------------------
INSERT INTO `economic_state` (`id`, `inflation_rate`, `monsoon_strength`, `rural_credit_modifier`, `fraud_index`, `agri_subsidy_modifier`, `investment_market_volatility`, `digital_fraud_index`) 
VALUES (1, 5.00, 1.00, 1.00, 0.05, 1.00, 1.00, 0.05);

-- ----------------------------
-- Table structure for action_logs
-- ----------------------------
CREATE TABLE IF NOT EXISTS `action_logs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `action_type` VARCHAR(100) NOT NULL,
  `metadata` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_log_user_id` (`user_id`),
  CONSTRAINT `fk_log_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
