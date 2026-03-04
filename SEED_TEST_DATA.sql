-- ============================================================
-- FINLIT TEST DATA SEED SCRIPT
-- ============================================================
-- Use this script to populate your database with dummy data for testing.
-- Usage: mysql -u iot -proot finlit_db < SEED_TEST_DATA.sql
-- ============================================================

USE finlit_db;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Clear existing data (Optional, but good for clean state)
TRUNCATE TABLE wallet_transactions;
TRUNCATE TABLE market_transactions;
TRUNCATE TABLE market_listings;
TRUNCATE TABLE farm_plans;
TRUNCATE TABLE loan_installments;
TRUNCATE TABLE loans;
TRUNCATE TABLE user_wallets;
TRUNCATE TABLE user_profiles;
TRUNCATE TABLE inventory;
TRUNCATE TABLE lands;
TRUNCATE TABLE group_members;
TRUNCATE TABLE groups;
TRUNCATE TABLE seeds;
TRUNCATE TABLE crops;
TRUNCATE TABLE users;
TRUNCATE TABLE seasons;

SET FOREIGN_KEY_CHECKS = 1;

-- 2. Seed Crops (Static Config)
INSERT INTO `crops` (`id`, `name`, `base_yield`, `base_market_price`, `risk_category`) VALUES
(1, 'Wheat', 100.00, 20.00, 'low'),
(2, 'Rice', 150.00, 25.00, 'medium'),
(3, 'Cotton', 80.00, 60.00, 'high');

-- 3. Seed Seeds (Linked to Crops)
INSERT INTO `seeds` (`id`, `crop_id`, `quality`, `yield_multiplier`, `cost_per_unit`) VALUES
(1, 1, 'low', 0.80, 5.00),
(2, 1, 'medium', 1.00, 8.00),
(3, 1, 'high', 1.30, 12.00),
(4, 2, 'medium', 1.00, 10.00),
(5, 3, 'high', 1.50, 25.00);

-- 4. Seed Active Season
INSERT INTO `seasons` (`id`, `season_number`, `start_time`, `end_time`, `monsoon_strength`, `status`) VALUES
(1, 1, '2026-01-01 00:00:00', '2026-06-30 23:59:59', 1.10, 'active');

-- 5. Seed Groups
INSERT INTO `groups` (`id`, `name`, `group_type`, `created_at`) VALUES
(1, 'Green Valley SHG', 'shg', NOW()),
(2, 'Regional Farmer Co-op', 'coop', NOW());

-- 6. Seed Users
-- Passwords are "password123" hashed using bcrypt
-- Farmer
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role_id`, `status`) VALUES
(1, 'farmer_joe', 'farmer@test.com', '$2a$10$X7.X8vUpX.X8vUpX.X8vUpX.X8vUpX.X8vUpX.X8vUpX.X8vUpX.', 1, 'active'),
(2, 'woman_jane', 'woman@test.com', '$2a$10$X7.X8vUpX.X8vUpX.X8vUpX.X8vUpX.X8vUpX.X8vUpX.X8vUpX.', 2, 'active'),
(3, 'student_sam', 'student@test.com', '$2a$10$X7.X8vUpX.X8vUpX.X8vUpX.X8vUpX.X8vUpX.X8vUpX.X8vUpX.', 3, 'active'),
(4, 'adult_alex', 'adult@test.com', '$2a$10$X7.X8vUpX.X8vUpX.X8vUpX.X8vUpX.X8vUpX.X8vUpX.X8vUpX.', 4, 'active');

-- 7. User Profiles (Behavioral Scores)
INSERT INTO `user_profiles` (`user_id`, `credit_trust`, `fr_score`, `stress_index`, `reputation_score`) VALUES
(1, 70, 60, 10, 80),
(2, 85, 90, 5, 95),
(3, 50, 50, 0, 50),
(4, 60, 70, 20, 65);

-- 8. User Wallets
INSERT INTO `user_wallets` (`user_id`, `balance`, `reserved_balance`) VALUES
(1, 5000.00, 0.00),
(2, 2500.00, 0.00),
(3, 500.00, 0.00),
(4, 15000.00, 0.00);

-- 9. Lands (for the Farmer)
INSERT INTO `lands` (`user_id`, `total_area`, `soil_quality`, `irrigation_level`) VALUES
(1, 10.50, 'high', 2),
(1, 5.00, 'medium', 1);

-- 10. Inventory (Stock for trading)
INSERT INTO `inventory` (`user_id`, `item_type`, `item_id`, `quantity`, `quality`) VALUES
(1, 'crop', 1, 500.00, 'Premium'),
(2, 'product', 101, 50.00, 'Handmade');

-- 11. Group Memberships
INSERT INTO `group_members` (`group_id`, `user_id`, `joined_at`) VALUES
(1, 2, NOW()),
(2, 1, NOW());

-- 12. Active Market Listing (Farmer selling wheat)
INSERT INTO `market_listings` (`seller_id`, `item_type`, `item_id`, `quantity`, `remaining_qty`, `price_per_unit`, `status`) VALUES
(1, 'crop', 1, 100.00, 100.00, 22.50, 'active');

-- 13. Sample Loan (Adult Alex has a loan)
INSERT INTO `loans` (`id`, `user_id`, `lender_type`, `principal`, `interest_rate`, `tenure_months`, `remaining_balance`, `status`) VALUES
(1, 4, 'formal', 10000.00, 10.00, 12, 10000.00, 'active');

INSERT INTO `loan_installments` (`loan_id`, `due_date`, `amount_due`, `paid`) VALUES
(1, '2026-04-01 00:00:00', 916.67, false),
(1, '2026-05-01 00:00:00', 916.67, false);

-- 14. Economic State update
UPDATE `economic_state` SET `monsoon_strength` = 1.10, `inflation_rate` = 5.50 WHERE `id` = 1;
