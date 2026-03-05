const { Router } = require('express');
const landController = require('../controllers/land.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = Router();

/**
 * @openapi
 * /api/lands:
 *   get:
 *     tags:
 *       - Agriculture
 *     summary: Get user land ownership
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of lands owned by the user
 */
router.get('/', landController.getLands);

/**
 * @openapi
 * /api/lands/seasons/active:
 *   get:
 *     tags:
 *       - Agriculture
 *     summary: Get currently active season
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active season details
 */
router.get('/seasons/active', landController.getActiveSeason);

/**
 * @openapi
 * /api/lands/farm-plans:
 *   post:
 *     tags:
 *       - Agriculture
 *     summary: Select crop for a season (Create farm plan)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [landId, seasonId, cropId, seedId, areaAllocated]
 *             properties:
 *               landId: { type: 'integer' }
 *               seasonId: { type: 'integer' }
 *               cropId: { type: 'integer' }
 *               seedId: { type: 'integer' }
 *               areaAllocated: { type: 'string', example: '5.5' }
 *     responses:
 *       201:
 *         description: Farm plan created
 */
router.post('/farm-plans', authorize('farmer'), landController.createFarmPlan);

module.exports = router;
