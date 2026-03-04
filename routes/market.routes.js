const { Router } = require('express');
const marketController = require('../controllers/market.controller');
const { protect } = require('../middleware/auth.middleware');

const router = Router();

/**
 * @openapi
 * /api/market/listings:
 *   get:
 *     tags:
 *       - Market
 *     summary: Get all active listings
 *     parameters:
 *       - in: query
 *         name: itemType
 *         schema: { type: 'string', enum: [crop, product] }
 *     responses:
 *       200:
 *         description: List of active market listings
 *   post:
 *     tags:
 *       - Market
 *     summary: Create a new listing
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [itemType, itemId, quantity, pricePerUnit]
 *             properties:
 *               itemType: { type: 'string', enum: [crop, product] }
 *               itemId: { type: 'integer' }
 *               quantity: { type: 'string' }
 *               pricePerUnit: { type: 'string' }
 *     responses:
 *       201:
 *         description: Listing created
 */
router.get('/listings', marketController.getListings);
router.post('/listings', protect, marketController.createListing);

/**
 * @openapi
 * /api/market/listings/{id}/buy:
 *   post:
 *     tags:
 *       - Market
 *     summary: Buy an item from a listing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [qty, offerPrice]
 *             properties:
 *               qty: { type: 'string' }
 *               offerPrice: { type: 'string' }
 *     responses:
 *       200:
 *         description: Purchase successful
 */
router.post('/listings/:id/buy', protect, marketController.buyItem);

module.exports = router;
