# FinLit Backend Implementation Roadmap

## Phase 0: Pre-flight & Verification
- [x] **Folder Structure Validation**
    - [x] Verify all core directories (`config/`, `controllers/`, `routes/`, `models/`, `services/`, `middleware/`, `utils/`) exist at the root.
    - [x] Ensure `app.js`, `server.js`, and `.env` are correctly placed in the root.
- [x] **Code Logic & Integrity Check**
    - [x] Audit `app.js` and `server.js` for correct CommonJS `require` paths.
    - [x] Verify that all route files in `routes/` correctly point to their respective controllers.
    - [x] Run `npm run dev` to ensure the server starts without module-not-found or syntax errors.
    - [x] Test the `/health` endpoint to confirm the basic Express setup is responsive.

## Phase 1: Foundation & Database Integrity
- [x] **Database Setup**
    - [x] Configure Sequelize with `mysql2` and `dotenv`.
    - [x] Implement DB Connection pooling and Health Check logic.
- [x] **Model Implementation (Sequelize)**
    - [x] Core: `User`, `Role`, `UserProfile`.
    - [x] Financial: `UserWallet`, `WalletTransaction`.
    - [x] Agri: `Land`, `Season`, `Crop`, `Seed`, `FarmPlan`.
    - [x] Market: `Inventory`, `MarketListing`, `MarketTransaction`.
    - [x] Credit: `Loan`, `LoanInstallment`.
    - [x] Systems: `IdempotencyKey`, `EconomicState`, `ActionLog`.
- [x] **Migrations**
    - [x] Database initialized via `SQL_Base.sql`.

## Phase 2: Authentication & Identity
- [x] **Auth System**
    - [x] Implement `POST /api/auth/register` with password hashing (bcrypt).
    - [x] Implement `POST /api/auth/login` with JWT generation.
    - [x] Implement Role-based authorization middleware.
- [x] **User Profiles**
    - [x] Logic for initializing `UserProfile` and `UserWallet` upon registration.
    - [x] Behavioral score update triggers (Initialized with defaults).

## Phase 3: Financial & Wallet Engine
- [x] **Atomic Ledger System**
    - [x] Service for processing transactions with `balance_before` and `balance_after`.
    - [x] Enforcement of `check_positive_balance` at the service level.
- [x] **Transfer Logic**
    - [x] Implement `POST /api/wallet/transfer` with DB transactions.
    - [x] Implement auditable transaction ledger for all wallet mutations.

## Phase 4: Agriculture & Seasonal Logic
- [x] **Agri Management**
    - [x] `GET /api/lands` and Land allocation.
    - [x] `POST /api/farm-plans` with yield calculation formulas.
- [x] **Seasonal Engine (Agriculture)**
    - [x] Logic to resolve farm plans at `end_time` of a season.
    - [x] Applying monsoon multipliers and inventory updates.

## Phase 5: Market & Inventory System
- [x] **Inventory Control**
    - [x] Automated inventory updates on harvest and purchase.
- [x] **Marketplace**
    - [x] `POST /api/market/listings` (Inventory lock/reserve).
    - [x] `POST /api/market/listings/:id/buy` (Atomic buyer/seller transaction).

## Phase 6: Credit & Loan Engine
- [x] **Loan Management**
    - [x] Loan application approval logic (Score-based).
    - [x] EMI generator for `loan_installments`.
- [x] **Repayment Logic**
    - [x] Implementation of installment repayment.
    - [x] Impact on `creditTrust` and `stressIndex`.

## Phase 7: Simulation Engines (Background)
- [x] **Monthly Engine**
    - [x] Salary credits, Savings goal autopay, and Interest compounding.
- [x] **Daily Micro Engine**
    - [x] Reputation growth and Stress passive adjustment.
- [x] **Global Event Engine**
    - [x] Random event triggers for Inflation and Monsoon strength.
- [x] **Manual Triggering**
    - [x] API endpoints to trigger engines manually for testing.

## Phase 8: Advanced Game Systems
- [x] **Insurance & Investment**
    - [x] Insurance policy purchase window (before midpoint).
    - [x] Investment purchase logic.
- [x] **Social/Budgeting**
    - [x] Group membership (SHG/Co-op).
    - [x] Budget tracking by category.

## Phase 9: System Integrity & Documentation
- [x] **Idempotency**
    - [x] Global middleware to handle `Idempotency-Key` headers.
- [x] **API Documentation**
    - [x] Complete Swagger specifications for all endpoints using dynamic JSDoc.
- [x] **Security & Validation**
    - [x] Centralized error handling middleware.
