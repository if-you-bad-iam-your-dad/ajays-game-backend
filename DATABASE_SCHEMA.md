# FinLit Database Schema & Design

## 1. Core Design Principles
* **Fully normalized (3NF+)**
* Financial mutations traceable (Ledger-based)
* Soft deletes where applicable
* Referential integrity enforced via Foreign Keys
* Separation of configuration (static) vs player state (dynamic)
* Extensible for new roles and features
* **Data Types:** `DECIMAL` for all money/quantity (never `FLOAT`)

## 2. User & Identity Layer
### users
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    status ENUM('active','suspended','deleted') DEFAULT 'active',
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);
```
### roles
```sql
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_key VARCHAR(50) UNIQUE, 
    description TEXT
);
-- Roles: farmer, woman, student, young_adult
```
### user_profiles (Behavior + Scores)
```sql
CREATE TABLE user_profiles (
    user_id BIGINT PRIMARY KEY,
    credit_trust INT DEFAULT 50,
    fr_score INT DEFAULT 50,
    stress_index INT DEFAULT 0,
    reputation_score INT DEFAULT 50,
    digital_confidence INT DEFAULT 0,
    scam_awareness INT DEFAULT 0,
    smart_decision_rate INT DEFAULT 50,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 3. Land & Agriculture System
### lands
```sql
CREATE TABLE lands (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    total_area DECIMAL(10,2),
    soil_quality ENUM('low','medium','high'),
    irrigation_level INT DEFAULT 0,
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```
### crops (Static Config)
```sql
CREATE TABLE crops (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    base_yield DECIMAL(10,2),
    base_market_price DECIMAL(10,2),
    risk_category ENUM('low','medium','high')
);
```
### seeds (Config Layer)
```sql
CREATE TABLE seeds (
    id INT PRIMARY KEY AUTO_INCREMENT,
    crop_id INT NOT NULL,
    quality ENUM('low','medium','high'),
    yield_multiplier DECIMAL(5,2),
    cost_per_unit DECIMAL(10,2),
    FOREIGN KEY (crop_id) REFERENCES crops(id)
);
```
### seasons
```sql
CREATE TABLE seasons (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    season_number INT,
    start_time DATETIME,
    end_time DATETIME,
    monsoon_strength DECIMAL(5,2),
    status ENUM('active','completed')
);
```
### farm_plans
```sql
CREATE TABLE farm_plans (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    land_id BIGINT NOT NULL,
    season_id BIGINT NOT NULL,
    crop_id INT NOT NULL,
    seed_id INT NOT NULL,
    area_allocated DECIMAL(10,2),
    planned_yield DECIMAL(12,2),
    yield_factor DECIMAL(5,2),
    status ENUM('planned','harvested','failed'),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (land_id) REFERENCES lands(id),
    FOREIGN KEY (season_id) REFERENCES seasons(id)
);
```

## 4. Inventory System
### inventory
```sql
CREATE TABLE inventory (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    item_type ENUM('crop','product','raw_material'),
    item_id BIGINT,
    quantity DECIMAL(12,2),
    quality VARCHAR(50),
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX (user_id, item_type)
);
```

## 5. Market System
### market_listings
```sql
CREATE TABLE market_listings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    seller_id BIGINT NOT NULL,
    item_type ENUM('crop','product'),
    item_id BIGINT,
    quantity DECIMAL(12,2),
    remaining_qty DECIMAL(12,2),
    price_per_unit DECIMAL(12,2),
    sale_type ENUM('open','consignment'),
    status ENUM('active','sold','cancelled'),
    created_at DATETIME,
    FOREIGN KEY (seller_id) REFERENCES users(id)
);
```
### market_transactions
```sql
CREATE TABLE market_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    listing_id BIGINT,
    buyer_id BIGINT,
    seller_id BIGINT,
    quantity DECIMAL(12,2),
    unit_price DECIMAL(12,2),
    total_amount DECIMAL(14,2),
    created_at DATETIME,
    FOREIGN KEY (listing_id) REFERENCES market_listings(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (seller_id) REFERENCES users(id)
);
```

## 6. Wallet & Ledger (CRITICAL)
### user_wallets
```sql
CREATE TABLE user_wallets (
    user_id BIGINT PRIMARY KEY,
    balance DECIMAL(14,2) DEFAULT 0.00,
    reserved_balance DECIMAL(14,2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```
### wallet_transactions (Audit Trail)
```sql
CREATE TABLE wallet_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    txn_type VARCHAR(50),
    reference_id BIGINT,
    amount DECIMAL(14,2),
    balance_before DECIMAL(14,2),
    balance_after DECIMAL(14,2),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 7. Idempotency & System Integrity
### idempotency_keys
```sql
CREATE TABLE idempotency_keys (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    idempotency_key VARCHAR(100) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    request_path VARCHAR(255) NOT NULL,
    response_code INT,
    response_body JSON,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 8. Loan System
### loans
```sql
CREATE TABLE loans (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    lender_type ENUM('formal','informal','shg','microfinance'),
    principal DECIMAL(14,2),
    interest_rate DECIMAL(5,2),
    tenure_months INT,
    remaining_balance DECIMAL(14,2),
    status ENUM('active','completed','defaulted'),
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```
### loan_installments
```sql
CREATE TABLE loan_installments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    loan_id BIGINT,
    due_date DATETIME,
    amount_due DECIMAL(14,2),
    paid BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (loan_id) REFERENCES loans(id)
);
```

## 8. Insurance
### insurance_policies
```sql
CREATE TABLE insurance_policies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    crop_id INT,
    season_id BIGINT,
    cover_amount DECIMAL(14,2),
    premium DECIMAL(14,2),
    status ENUM('active','claimed','expired'),
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (crop_id) REFERENCES crops(id),
    FOREIGN KEY (season_id) REFERENCES seasons(id)
);
```

## 9. Investment System
### investment_products (Config)
```sql
CREATE TABLE investment_products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_type ENUM('sip','bond','farmer_bond'),
    base_return_rate DECIMAL(5,2),
    volatility DECIMAL(5,2)
);
```
### user_investments
```sql
CREATE TABLE user_investments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    product_id INT,
    invested_amount DECIMAL(14,2),
    current_value DECIMAL(14,2),
    maturity_date DATETIME,
    status ENUM('active','matured','withdrawn'),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES investment_products(id)
);
```

## 10. Savings Goals
### savings_goals
```sql
CREATE TABLE savings_goals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    goal_amount DECIMAL(14,2),
    deadline DATETIME,
    current_saved DECIMAL(14,2),
    status ENUM('active','achieved','failed'),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 11. Groups (SHG / Co-op)
### groups
```sql
CREATE TABLE groups (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    group_type ENUM('shg','coop'),
    created_at DATETIME
);
```
### group_members
```sql
CREATE TABLE group_members (
    group_id BIGINT,
    user_id BIGINT,
    joined_at DATETIME,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 12. Budget Planner
### budgets
```sql
CREATE TABLE budgets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    category VARCHAR(50),
    allocated_amount DECIMAL(14,2),
    period ENUM('monthly'),
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 13. Fraud Events
### fraud_events
```sql
CREATE TABLE fraud_events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    event_type VARCHAR(100),
    loss_amount DECIMAL(14,2),
    resolved BOOLEAN DEFAULT FALSE,
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 14. Global Economic Variables
### economic_state (Single-row)
```sql
CREATE TABLE economic_state (
    id INT PRIMARY KEY,
    inflation_rate DECIMAL(5,2),
    monsoon_strength DECIMAL(5,2),
    rural_credit_modifier DECIMAL(5,2),
    fraud_index DECIMAL(5,2),
    updated_at DATETIME
);
```

## 15. Audit System
### action_logs
```sql
CREATE TABLE action_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    action_type VARCHAR(100),
    metadata JSON,
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 16. Indexing & Performance
* **Required Indexes:** `user_id` (all child tables), `listing_id`, `loan_id`, `season_id`, `crop_id`, `due_date`, `maturity_date`.
* **Storage Engine:** InnoDB (mandatory for transactions and foreign keys).
* **Concurrency:** Use row-level locking and optimistic locking (version column) where necessary.
* **Integrity:** Constraints must prevent negative balances. Financial operations must be wrapped in DB transactions.
