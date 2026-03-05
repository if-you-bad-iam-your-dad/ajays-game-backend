const { Router } = require('express');
const systemController = require('../controllers/system.controller');

const router = Router();

/**
 * @openapi
 * /api/system/game-state:
 *   get:
 *     tags:
 *       - System
 *     summary: Bootstrap — Get initial game state
 *     description: Returns the current economic state, active season, crops, and seeds. Used for Unity client initialization. No auth required.
 *     security: []
 *     responses:
 *       200:
 *         description: Full game world state
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         economicState: { $ref: '#/components/schemas/EconomicState' }
 *                         activeSeason: { $ref: '#/components/schemas/Season' }
 *                         crops:
 *                           type: array
 *                           items: { $ref: '#/components/schemas/Crop' }
 *                         seeds:
 *                           type: array
 *                           items: { $ref: '#/components/schemas/Seed' }
 *
 * /api/system/engine/monthly:
 *   post:
 *     tags:
 *       - System
 *     summary: Trigger Monthly Financial Engine
 *     description: Processes EMI dues, salary credits, savings autopay, investment compounding, and stress recalculation.
 *     security:
 *       - UserIdAuth: []
 *     responses:
 *       200:
 *         description: Monthly engine triggered successfully
 *
 * /api/system/engine/daily:
 *   post:
 *     tags:
 *       - System
 *     summary: Trigger Daily Micro Engine
 *     description: Processes fraud probability changes, reputation decay/growth, digital behavior drift, and stress adjustments.
 *     security:
 *       - UserIdAuth: []
 *     responses:
 *       200:
 *         description: Daily engine triggered successfully
 *
 * /api/system/engine/events:
 *   post:
 *     tags:
 *       - System
 *     summary: Trigger Global Economic Events
 *     description: Applies random macro events (monsoon strength, inflation, RBI policy, subsidies, fraud surges) to the shared economy.
 *     security:
 *       - UserIdAuth: []
 *     responses:
 *       200:
 *         description: Global events triggered
 *
 * /api/system/seasons/resolve:
 *   post:
 *     tags:
 *       - System
 *     summary: Resolve active season (Harvest)
 *     description: Triggers harvest resolution for all farm plans in the specified season. Applies monsoon multiplier, insurance payouts, and supply index updates.
 *     security:
 *       - UserIdAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [seasonId]
 *             properties:
 *               seasonId: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Season resolved and harvests computed
 */
router.get('/game-state', systemController.getGameState);
router.post('/engine/monthly', systemController.triggerMonthlyEngine);
router.post('/engine/daily', systemController.triggerDailyEngine);
router.post('/engine/events', systemController.triggerGlobalEvents);
router.post('/seasons/resolve', systemController.triggerSeasonResolution);

module.exports = router;
