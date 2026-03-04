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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password, role_key]
 *             properties:
 *               username: { type: 'string' }
 *               email: { type: 'string' }
 *               password: { type: 'string' }
 *               role_key: { type: 'string', enum: [farmer, woman, student, young_adult] }
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', authController.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: 'string' }
 *               password: { type: 'string' }
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', authController.login);

module.exports = router;
