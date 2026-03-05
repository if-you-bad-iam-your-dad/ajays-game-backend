const { Router } = require('express');
const marketController = require('../controllers/market.controller');

const router = Router();

/**
 * @openapi
 * /api/market/listings:
 *   get:
 *     tags:
 *       - Market
 *     summary: Get all active listings
 *     security:
 *       - UserIdAuth: []
 *     parameters:
 *       - in: query
 *         name: itemType
 *         schema: { type: string, enum: [crop, product] }
 *     responses:
 *       200:
 *         description: List of active market listings
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/MarketListing' }
 *   post:
 *     tags:
 *       - Market
 *     summary: Create a new market listing
 *     security:
 *       - UserIdAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [itemType, itemId, quantity, pricePerUnit]
 *             properties:
 *               itemType: { type: string, enum: [crop, product] }
 *               itemId: { type: integer, example: 1 }
 *               quantity: { type: string, example: '10.00' }
 *               pricePerUnit: { type: string, example: '25.00' }
 *     responses:
 *       201:
 *         description: Listing created
 *
 * /api/market/listings/{id}/buy:
 *   post:
 *     tags:
 *       - Market
 *     summary: Buy an item from a listing
 *     security:
 *       - UserIdAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Market listing ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [qty, offerPrice]
 *             properties:
 *               qty: { type: string, example: '5.00' }
 *               offerPrice: { type: string, example: '25.00' }
 *     responses:
 *       200:
 *         description: Purchase successful
 */
router.get('/listings', marketController.getListings);
router.post('/listings', marketController.createListing);
router.post('/listings/:id/buy', marketController.buyItem);

module.exports = router;
