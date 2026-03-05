const { Router } = require('express');
const systemController = require('../controllers/system.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = Router();

/**
 * @openapi
 * /api/system/game-state:
 *   get:
 *     tags: [System]
 *     summary: Get initial game state (Bootstrap)
 *     description: Returns current economic state, active season, and crops/seeds for Unity client initialization.
 *     responses:
 *       200:
 *         description: Initial game world state
 */
router.get('/game-state', systemController.getGameState);

/**
 * @openapi
 * /api/system/engine/monthly:
 *   post:
 *     tags: [System]
 *     summary: Trigger Monthly Financial Engine
 *     security: [{ bearerAuth: [] }]
 */
router.post('/engine/monthly', authorize('farmer', 'woman', 'student', 'young_adult'), systemController.triggerMonthlyEngine);

/**
 * @openapi
 * /api/system/engine/daily:
 *   post:
 *     tags: [System]
 *     summary: Trigger Daily Micro Engine
 *     security: [{ bearerAuth: [] }]
 */
router.post('/engine/daily', systemController.triggerDailyEngine);

/**
 * @openapi
 * /api/system/engine/events:
 *   post:
 *     tags: [System]
 *     summary: Trigger Global Economic Events
 *     security: [{ bearerAuth: [] }]
 */
router.post('/engine/events', systemController.triggerGlobalEvents);

/**
 * @openapi
 * /api/system/seasons/resolve:
 *   post:
 *     tags: [System]
 *     summary: Resolve an active season (Harvest resolution)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [seasonId]
 *             properties:
 *               seasonId: { type: 'integer' }
 */
router.post('/seasons/resolve', systemController.triggerSeasonResolution);

module.exports = router;
