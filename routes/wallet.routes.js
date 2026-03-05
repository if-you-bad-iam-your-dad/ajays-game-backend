const { Router } = require('express');
const walletController = require('../controllers/wallet.controller');
const { protect } = require('../middleware/auth.middleware');

const router = Router();

/**
 * @openapi
 * /api/wallet:
 *   get:
 *     tags:
 *       - Wallet
 *     summary: Get user wallet details
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current wallet balance and reserved funds
 * /api/wallet/transactions:
 *   get:
 *     tags:
 *       - Wallet
 *     summary: Get wallet transaction ledger
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: 'integer', default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: 'integer', default: 10 }
 *     responses:
 *       200:
 *         description: Paginated transaction ledger
 * /api/wallet/transfer:
 *   post:
 *     tags:
 *       - Wallet
 *     summary: Transfer funds between users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [recipientId, amount]
 *             properties:
 *               recipientId: { type: 'integer' }
 *               amount: { type: 'string', example: '100.00' }
 *               reason: { type: 'string' }
 *     responses:
 *       200:
 *         description: Transfer successful
 */
router.get('/', walletController.getWallet);
router.get('/transactions', walletController.getTransactions);
router.post('/transfer', walletController.transferFunds);

module.exports = router;
