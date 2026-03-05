const { Router } = require('express');
const walletController = require('../controllers/wallet.controller');

const router = Router();

/**
 * @openapi
 * /api/wallet:
 *   get:
 *     tags:
 *       - Wallet
 *     summary: Get wallet balance
 *     security:
 *       - UserIdAuth: []
 *     responses:
 *       200:
 *         description: Current wallet balance and reserved funds
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/Wallet' }
 *
 * /api/wallet/transactions:
 *   get:
 *     tags:
 *       - Wallet
 *     summary: Get wallet transaction ledger
 *     security:
 *       - UserIdAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Paginated transaction ledger
 *
 * /api/wallet/transfer:
 *   post:
 *     tags:
 *       - Wallet
 *     summary: Transfer funds to another user
 *     security:
 *       - UserIdAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [recipientId, amount]
 *             properties:
 *               recipientId: { type: integer, example: 2 }
 *               amount: { type: string, example: '100.00' }
 *               reason: { type: string, example: 'Payment for crops' }
 *     responses:
 *       200:
 *         description: Transfer successful
 */
router.get('/', walletController.getWallet);
router.get('/transactions', walletController.getTransactions);
router.post('/transfer', walletController.transferFunds);

module.exports = router;
