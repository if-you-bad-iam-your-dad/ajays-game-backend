const { Router } = require('express');
const userController = require('../controllers/user.controller');

const router = Router();

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user profile
 *     description: Returns full profile, wallet, and behavioral scores for the authenticated player.
 *     security:
 *       - UserIdAuth: []
 *     responses:
 *       200:
 *         description: User profile, wallet, and scores
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/User'
 *                         - type: object
 *                           properties:
 *                             profile: { $ref: '#/components/schemas/UserProfile' }
 *                             wallet: { $ref: '#/components/schemas/Wallet' }
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update current user profile
 *     security:
 *       - UserIdAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.get('/me', userController.getMe);
router.patch('/me', userController.updateMe);

module.exports = router;
