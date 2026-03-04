# FinLit Backend Logic & Instructions

## 0. Core Principles
1. **Server Authoritative**
   - Client sends intent only.
   - Server computes: outcome, probability, yield, debt, penalties, rewards.
2. **Deterministic + Controlled Randomness**
   - All randomness: server-side, seeded per user + time window, auditable.
3. **Real-Time Progression**
   - Game state evolves continuously via seasonal, monthly, and daily engines.
4. **Idempotency & Integrity**
   - All critical write operations (market, loans, planting) must support `Idempotency-Key` to prevent duplicate processing.
   - High-integrity relational structure with mandatory DB transactions for all financial mutations.

## 1. Global World Model (India Real-Time)
The entire system operates on a single shared India economy.
- **Global variables:** `inflationRate`, `monsoonStrength`, `agriSubsidyModifier`, `ruralCreditModifier`, `digitalFraudIndex`, `investmentMarketVolatility`, `supplyIndex` (per commodity), `demandIndex` (per commodity).
- Recalculated dynamically.

## 2. Core Player State Model (Logical)
Each player has:
- **Financial:** `cashBalance`, `totalDebt`, `liquidAssets`, `investmentValue`.
- **Behavioral:** `creditTrust` (0–100), `FRScore` (financial responsibility), `stressIndex` (0–100), `reputationScore`, `digitalConfidence`, `scamAwareness`, `smartDecisionRate`.
- **Operational:** `activeCropPlan`, `activeLoans`, `activeInsurance`, `activeInvestments`, `businessState`, `budgetPlan`.
- All actions mutate this state.

## 3. Time Engines (Real-Time Processors)
### A. Seasonal Engine (Agriculture)
- **Triggers:** Season start, midpoint lock, season end.
- **On Season End:** Resolve farm plans, apply monsoon multiplier, apply insurance logic, update `supplyIndex`, reset seasonal variables.
### B. Monthly Financial Engine
- **Triggers:** Loan EMI due, Salary credit, Savings autopay, Investment compounding, Budget compliance check, Stress recalculation.
### C. Daily Micro Engine
- **Triggers:** Fraud wave probability change, Reputation decay/growth, Digital behavior drift, Stress passive adjustment.

## 4. Farmer Backend Logic
- **Crop Selection:** Validation (no active crop, season active, balance), Server computes `plannedYield`.
  - **Formula:** `planned_yield = crop.base_yield * areaAllocated * seed.yield_multiplier`.
- **Input Investment:** Increases `yieldFactor` and `leverageRiskWeight`.
- **Insurance Purchase:** Before midpoint, no duplicates.
- **Harvest (Server-Triggered):** `finalYield` calculated with monsoon and investment factors. Payouts processed if insured.
- **Market Listing:** Inventory validation, attractiveness based on price/reputation.
- **Market Purchase:** Atomic transaction between buyer/seller, updates demand/price.
- **Group Participation:** Modifiers for interest, insurance, and reputation.

## 5. Woman Role Backend Logic
- **Budget Planner:** Calculates deficit ratio, impacts `stress` and `FRScore` based on compliance.
- **Buy Goods:** Transaction logic same as market engine; digital payments trigger fraud probability.
- **Micro-Business:** Profit = `(sellPrice - buyPrice) * quantity`. Reputation and stress impacts.
- **Savings Goal:** Autopay on income; success impacts `FRScore`, failure impacts `stress`.
- **Digital Skill:** Increases `digitalConfidence`, decreases `scamProbability`.
- **Microcredit:** Group membership lowers interest and penalties.

## 6. Student Role Backend Logic
- **Allowance Engine:** Monthly credit, overspend impacts `smartDecisionRate`.
- **Impulse Purchase:** Satisfaction vs. savings/decision rate tradeoff.
- **Micro-Invest:** Compound interest with early withdrawal penalties.
- **Scam Module:** Increases `scamAwareness`.
- **Peer Lending:** Default probability based on reputation, stress, and debt ratio.

## 7. Young Adult Role Backend Logic
- **Salary Management:** Income credit, autopay execution, penalty/creditTrust impact on failure.
- **Investment Engine:** Value updates based on market growth/volatility (influenced by macro factors).
- **Credit Usage:** Debt generation, billing cycles, penalty/stress on missed payments.
- **Lend to Farmer:** Returns based on farmer reputation and monsoon status.
- **Enterprise Management:** Revenue, costs, tax, and inventory tracking.

## 8. Loan Engine (Unified)
- **Approval Probability:** Based on `creditTrust`, `debtRatio`, `stressIndex`, `groupBonus`.
- **Interest Rate:** Influenced by `ruralCreditModifier` and `reputationScore`.
- **EMI:** Amortized calculation.
- **Missed EMI:** Penalty interest, `creditTrust` hit, `stress` increase. Default after 3 misses.

## 9. Fraud Engine
- **Probability:** Based on `baseRate`, `digitalFraudIndex`, `digitalConfidence`, `scamAwareness`.
- **Consequences:** Loss of cash, `FRScore` hit, `stress` increase.
- **Reporting:** Increases reputation and slightly reduces community `fraudIndex`.

## 10. Reputation Engine
- **Increases:** Successful trade, timely repayment, correct fraud behavior, group participation.
- **Decreases:** Default, fraud victim, unethical trading.
- **Affects:** Sale speed, investor trust, loan approval bias.

## 11. Stress Engine
- **Increases:** Crop failure, loan overdue, failed savings, business/fraud loss.
- **Affects:** Higher impulse probability, higher default probability, lower `smartDecisionRate`.
- **Decay:** Slow recovery over time if stable.

## 12. Global Event Engine (India Context)
Random events (Monsoon strength, Inflation, RBI policy, Subsidies, Fraud surges) modify macro variables for a defined duration.

## 13. Anti-Exploit Requirements
- Prevent double harvest, double listing, negative balance, duplicate insurance claims, EMI bypass, race condition purchases.
- All financial operations must be inside DB transactions.

## 14. Audit & Logging Requirements
Every financial mutation must log: `beforeBalance`, `afterBalance`, `reasonCode`, `timestamp`.

## 15. System Stability Rules
- Circuit breaker for economic collapse.
- Minimum price floor and inflation dampening.
- Default cap ratio and stress overflow protection.

## 16. Operational Rules
- **Server Execution:** The AI agent must NOT start the server automatically (e.g., using background processes or `npm run dev`) unless explicitly asked by the user for a specific verification step. The user is responsible for managing the server lifecycle.
- **Port Management:** Assume the server runs on the port defined in `.env` (default 5000).

## 17. Final Architecture Summary
Real-time, event-driven, server-authoritative, India macroeconomic multiplayer simulation engine with shared agri output, market pricing, credit risk, behavioral finance, fraud, stress psychology, and policy shock simulation. No NPCs. Fully player-driven economy.
