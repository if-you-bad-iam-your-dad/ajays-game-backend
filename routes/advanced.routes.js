const { Router } = require('express');
const advancedController = require('../controllers/advanced.controller');

const router = Router();

/**
 * @openapi
 * /api/advanced/insurance/buy:
 *   post:
 *     tags:
 *       - Advanced
 *     summary: Buy a crop insurance policy
 *     description: Insurance can only be purchased before the season midpoint. One policy per season per user.
 *     security:
 *       - UserIdAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cropId, seasonId, coverAmount, premium]
 *             properties:
 *               cropId: { type: integer, example: 1 }
 *               seasonId: { type: integer, example: 1 }
 *               coverAmount: { type: string, example: '10000.00' }
 *               premium: { type: string, example: '500.00' }
 *     responses:
 *       201:
 *         description: Insurance policy created and premium deducted from wallet
 *       400:
 *         description: Error (past midpoint, already insured, or insufficient funds)
 *
 * /api/advanced/invest:
 *   post:
 *     tags:
 *       - Advanced
 *     summary: Create an investment (SIP / Bond)
 *     description: |
 *       Investment value updates are based on market growth/volatility influenced by `investmentMarketVolatility`.
 *       Early withdrawal penalties apply before maturity date.
 *     security:
 *       - UserIdAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productType, amount, maturityDate]
 *             properties:
 *               productType: { type: string, enum: [sip, bond, farmer_bond] }
 *               amount: { type: string, example: '100.00' }
 *               maturityDate: { type: string, format: date, example: '2027-01-01' }
 *     responses:
 *       201:
 *         description: Investment created and amount deducted from wallet
 *
 * /api/advanced/groups/join:
 *   post:
 *     tags:
 *       - Advanced
 *     summary: Join a SHG or Co-op group
 *     description: Group membership provides lower loan interest rates, insurance discounts, and reputation bonuses.
 *     security:
 *       - UserIdAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [groupId]
 *             properties:
 *               groupId: { type: integer, example: 1 }
 *     responses:
 *       201:
 *         description: Joined group successfully
 *
 * /api/advanced/budget:
 *   post:
 *     tags:
 *       - Advanced
 *     summary: Set or update a monthly budget category
 *     description: Budget compliance impacts `FRScore` (success) and `stressIndex` (failure). Used by the Woman role.
 *     security:
 *       - UserIdAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [category, allocatedAmount]
 *             properties:
 *               category: { type: string, example: 'Education' }
 *               allocatedAmount: { type: string, example: '5000.00' }
 *     responses:
 *       200:
 *         description: Budget category set successfully
 */
router.post('/insurance/buy', advancedController.buyInsurance);
router.post('/invest', advancedController.invest);
router.post('/groups/join', advancedController.joinGroup);
router.post('/budget', advancedController.setBudget);

module.exports = router;
