const { Router } = require('express');
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

const router = Router();

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile, wallet, and basic stats
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update current user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: 'string' }
 *               email: { type: 'string' }
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.get('/me', userController.getMe);
router.patch('/me', userController.updateMe);

module.exports = router;
