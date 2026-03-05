const { Router } = require('express');
const authController = require('../controllers/auth.controller');

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a new player account. No header required.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password, role_key]
 *             properties:
 *               username: { type: string, example: farmer_ajay }
 *               email: { type: string, example: ajay@example.com }
 *               password: { type: string, example: password123 }
 *               role_key:
 *                 type: string
 *                 enum: [farmer, woman, student, young_adult]
 *                 example: farmer
 *     responses:
 *       201:
 *         description: User registered successfully. Use the returned id as X-User-Id in subsequent requests.
 */
router.post('/register', authController.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login — returns userId
 *     description: Validates credentials and returns the userId. Pass this as the `X-User-Id` header for all protected requests.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: farmer@test.com }
 *               password: { type: string, example: password123 }
 *     responses:
 *       200:
 *         description: Returns userId and user info. Use userId as X-User-Id header going forward.
 */
router.post('/login', authController.login);

module.exports = router;
