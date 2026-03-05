const { Router } = require('express');
const loanController = require('../controllers/loan.controller');

const router = Router();

/**
 * @openapi
 * /api/loans:
 *   get:
 *     tags:
 *       - Loans
 *     summary: Get user loans and installments
 *     security:
 *       - UserIdAuth: []
 *     responses:
 *       200:
 *         description: List of active and past loans
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Loan' }
 *
 * /api/loans/apply:
 *   post:
 *     tags:
 *       - Loans
 *     summary: Apply for a new loan
 *     description: |
 *       Approval probability is based on `creditTrust`, `debtRatio`, `stressIndex`, and group membership bonus.
 *       Interest rate is influenced by `ruralCreditModifier` and `reputationScore`.
 *     security:
 *       - UserIdAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [lenderType, principal, interestRate, tenureMonths]
 *             properties:
 *               lenderType: { type: string, enum: [formal, informal, shg, microfinance] }
 *               principal: { type: string, example: '5000.00' }
 *               interestRate: { type: string, example: '12.0' }
 *               tenureMonths: { type: integer, example: 12 }
 *     responses:
 *       201:
 *         description: Loan approved and disbursed to wallet
 *
 * /api/loans/installments/{id}/repay:
 *   post:
 *     tags:
 *       - Loans
 *     summary: Repay a specific loan installment
 *     security:
 *       - UserIdAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Loan installment ID
 *     responses:
 *       200:
 *         description: Installment repaid successfully
 */
router.get('/', loanController.getLoans);
router.post('/apply', loanController.applyLoan);
router.post('/installments/:id/repay', loanController.repayLoan);

module.exports = router;
