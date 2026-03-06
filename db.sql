 
-- ==============================
-- ROLES
-- ==============================

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('farmer','woman','student','young_adult','admin') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==============================
-- LANGUAGES
-- ==============================

CREATE TABLE languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    data_url TEXT,
    description TEXT
);

-- ==============================
-- USERS
-- ==============================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role_id INT,
    language INT,
    status ENUM('online','offline') DEFAULT 'offline',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (language) REFERENCES languages(id)
);

-- ==============================
-- WORKS
-- ==============================

CREATE TABLE works (
    id INT AUTO_INCREMENT PRIMARY KEY,
    industry VARCHAR(150),
    description TEXT,
    salary DECIMAL(12,2),
    experience_required INT
);

-- ==============================
-- USER PROFILES
-- ==============================

CREATE TABLE farmers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    experience INT DEFAULT 0,
    money DECIMAL(12,2) DEFAULT 0,
    savings DECIMAL(12,2) DEFAULT 0,
    reputation INT DEFAULT 0,
    financial_knowledge_score INT DEFAULT 0,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE women (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    experience INT DEFAULT 0,
    money DECIMAL(12,2) DEFAULT 0,
    savings DECIMAL(12,2) DEFAULT 0,
    reputation INT DEFAULT 0,
    financial_knowledge_score INT DEFAULT 0,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    experience INT DEFAULT 0,
    money DECIMAL(12,2) DEFAULT 0,
    savings DECIMAL(12,2) DEFAULT 0,
    reputation INT DEFAULT 0,
    financial_knowledge_score INT DEFAULT 0,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE young_adults (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    experience INT DEFAULT 0,
    work INT,
    money DECIMAL(12,2) DEFAULT 0,
    savings DECIMAL(12,2) DEFAULT 0,
    reputation INT DEFAULT 0,
    financial_knowledge_score INT DEFAULT 0,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (work) REFERENCES works(id)
);

-- ==============================
-- FARMER GAMEPLAY SYSTEM
-- ==============================

CREATE TABLE farmer_seeds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150),
    description TEXT,
    growth_time INT,
    water_requirement INT,
    produce_possibility INT,
    base_price DECIMAL(12,2)
);

CREATE TABLE crops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150),
    price DECIMAL(12,2),
    minimum_price DECIMAL(12,2),
    maximum_price DECIMAL(12,2),
    description TEXT
);

CREATE TABLE farmer_land_states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    state VARCHAR(100),
    description TEXT
);

CREATE TABLE farmer_lands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    state_id INT,
    seed_id INT,
    water_level INT,
    fertility_level INT,
    planted_time TIMESTAMP,
    harvest_time TIMESTAMP,
    used_slots INT,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (state_id) REFERENCES farmer_land_states(id),
    FOREIGN KEY (seed_id) REFERENCES farmer_seeds(id)
);

CREATE TABLE farmer_storage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT,
    capacity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);

CREATE TABLE farmer_storage_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    storage_id INT,
    crop_id INT,
    quantity INT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (storage_id) REFERENCES farmer_storage(id),
    FOREIGN KEY (crop_id) REFERENCES crops(id)
);

CREATE TABLE farmer_shop (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT,
    reputation INT,

    FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);

CREATE TABLE farmer_shop_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shop_id INT,
    crop_id INT,
    price DECIMAL(12,2),
    stock INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (shop_id) REFERENCES farmer_shop(id),
    FOREIGN KEY (crop_id) REFERENCES crops(id)
);

-- ==============================
-- FINANCIAL SYSTEM
-- ==============================

CREATE TABLE bank_system (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    cibil_score INT,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE banks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150),
    description TEXT,
    credit_interest DECIMAL(5,2),
    debit_interest DECIMAL(5,2)
);

CREATE TABLE bank_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    bank_id INT,
    balance DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (bank_id) REFERENCES banks(id)
);

CREATE TABLE credit_loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account INT,
    added_amount DECIMAL(12,2),
    total_amount DECIMAL(12,2),
    active BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (account) REFERENCES bank_accounts(id)
);

CREATE TABLE debit_loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account INT,
    paid_amount DECIMAL(12,2),
    total_amount DECIMAL(12,2),
    active BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (account) REFERENCES bank_accounts(id)
);

CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,

    level ENUM('DEBUG','INFO','WARNING','ERROR','CRITICAL') NOT NULL,

    module VARCHAR(150),
    action VARCHAR(150),

    log TEXT,
    description TEXT,

    user_id INT,
    caused_by_user VARCHAR(150),

    ip_address VARCHAR(45),
    user_agent TEXT,

    session_id VARCHAR(255),
    request_id VARCHAR(255),

    metadata JSON,
    stack_trace TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);