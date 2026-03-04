const { Router } = require('express');
const loanController = require('../controllers/loan.controller');
const { protect } = require('../middleware/auth.middleware');

const router = Router();

/**
 * @openapi
 * /api/loans:
 *   get:
 *     tags:
 *       - Loans
 *     summary: Get user loans and installments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active and past loans
 */
router.get('/', protect, loanController.getLoans);

/**
 * @openapi
 * /api/loans/apply:
 *   post:
 *     tags:
 *       - Loans
 *     summary: Apply for a new loan
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [lenderType, principal, interestRate, tenureMonths]
 *             properties:
 *               lenderType: { type: 'string', enum: [formal, informal, shg, microfinance] }
 *               principal: { type: 'string', example: '5000.00' }
 *               interestRate: { type: 'string', example: '12.0' }
 *               tenureMonths: { type: 'integer', example: 12 }
 *     responses:
 *       201:
 *         description: Loan approved and disbursed
 */
router.post('/apply', protect, loanController.applyLoan);

/**
 * @openapi
 * /api/loans/installments/{id}/repay:
 *   post:
 *     tags:
 *       - Loans
 *     summary: Repay a specific loan installment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: 'integer' }
 *     responses:
 *       200:
 *         description: Installment repaid successfully
 */
router.post('/installments/:id/repay', protect, loanController.repayLoan);

module.exports = router;
