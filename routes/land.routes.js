const { Router } = require('express');
const landController = require('../controllers/land.controller');

const router = Router();

/**
 * @openapi
 * /api/lands:
 *   get:
 *     tags:
 *       - Agriculture
 *     summary: Get user land ownership
 *     security:
 *       - UserIdAuth: []
 *     responses:
 *       200:
 *         description: List of lands owned by the user
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Land' }
 *
 * /api/lands/seasons/active:
 *   get:
 *     tags:
 *       - Agriculture
 *     summary: Get currently active season
 *     security:
 *       - UserIdAuth: []
 *     responses:
 *       200:
 *         description: Active season details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/Season' }
 *
 * /api/lands/farm-plans:
 *   post:
 *     tags:
 *       - Agriculture
 *     summary: Create farm plan (select crop for a season)
 *     description: |
 *       Formula: `planned_yield = crop.base_yield * areaAllocated * seed.yield_multiplier`
 *       Only available for the `farmer` role. Only one active plan per season allowed.
 *     security:
 *       - UserIdAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [landId, seasonId, cropId, seedId, areaAllocated]
 *             properties:
 *               landId: { type: integer, example: 1 }
 *               seasonId: { type: integer, example: 1 }
 *               cropId: { type: integer, example: 1 }
 *               seedId: { type: integer, example: 1 }
 *               areaAllocated: { type: string, example: '5.5' }
 *     responses:
 *       201:
 *         description: Farm plan created with computed planned_yield
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/FarmPlan' }
 */
router.get('/', landController.getLands);
router.get('/seasons/active', landController.getActiveSeason);
router.post('/farm-plans', landController.createFarmPlan);

module.exports = router;
