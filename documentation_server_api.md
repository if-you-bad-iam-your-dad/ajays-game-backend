# FinLit Production API Specification (Client ↔ Server)

This document serves as the single source of truth for the Unity client interaction with the Node.js/MySQL backend.

## 1. Conventions & Auth
* **Auth:** Bearer JWT in `Authorization: Bearer <access_token>`.
* **Idempotency:** All write operations accept an optional `Idempotency-Key` header.
* **Data Types:** All monetary/quantity values are `DECIMAL` strings.
* **Response Format:**
  ```json
  {
    "success": boolean,
    "data": {},
    "error": { "code": "STRING", "message": "STRING" }
  }
  ```
* **Pagination:** `?page=<n>&limit=<m>`
* **Timestamps:** ISO8601 (`YYYY-MM-DDTHH:mm:ssZ`)

---

## 2. API Endpoints

### 2.1 Authentication & Account
* `POST /api/auth/register` - Body: `{ username, email, password, role_key }`
* `POST /api/auth/login` - Body: `{ email, password }`
* `POST /api/auth/refresh` - Body: `{ refreshToken }`
* `POST /api/auth/logout` - Auth required.
* `POST /api/auth/request-password-reset`
* `POST /api/auth/reset-password`

### 2.2 Users & Profile
* `GET /api/users/me` - Returns user, profile, and wallet.
* `PATCH /api/users/me` - Update profile details.
* `GET /api/users/:id` - Public profile view.

### 2.3 Wallet & Ledger
* `GET /api/wallet` - Get balance and reserved funds.
* `GET /api/wallet/transactions` - Paginated ledger.
* `POST /api/wallet/transfer` - User-to-user transfers.

### 2.4 Lands & Agriculture
* `GET /api/lands` - User land ownership.
* `POST /api/farm-plans` - Select crop for a season.
  - **Logic:** `planned_yield = crop.base_yield * areaAllocated * seed.yield_multiplier`.
* `POST /api/farm-plans/:id/invest-input` - Invest in fertilizers/tools.

### 2.5 Market
* `GET /api/market/listings` - Search active listings.
* `POST /api/market/listings` - Create a new listing (reserves inventory).
* `POST /api/market/listings/:id/buy` - Execute purchase (Authoritative server pricing).

### 2.6 Loans & Repayments
* `POST /api/loans/apply` - Based on `approvalScore` from profile.
* `POST /api/loans/:id/repay` - Repay specific installments.

### 2.7 Insurance
* `POST /api/insurance/policies` - Buy coverage before season midpoint.
* `POST /api/insurance/:id/claim` - Triggered by weather events.

---

## 3. Realtime (WebSocket) Topics
* `season_updates` - Start/End of seasons.
* `market_updates` - Listing changes and price signals.
* `user_wallet` - Individual balance changes.
* `global_events` - Macroeconomic shocks (Monsoon, Inflation).

---

## 4. Concurrency & Integrity
* **Transactions:** All financial mutations must use InnoDB transactions.
* **Locking:** Use `SELECT ... FOR UPDATE` for inventory/listing/loan processing.
* **Idempotency:** Required for `/market/listings`, `/market/buy`, `/loans/apply`, `/farm-plans`.
* **Conflict Resolution:** Return `409 Conflict` on stale updates (Optimistic Locking).

---

## 5. Error Codes (Unity Mapping)
* `ERR_INSUFFICIENT_FUNDS`
* `ERR_INVENTORY_SHORT`
* `ERR_SEASON_LOCKED`
* `ERR_LOAN_DENIED`
* `ERR_IDEMPOTENCY_DUP`
