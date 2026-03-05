const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/auth.routes');
const marketRoutes = require('./routes/market.routes');
const userRoutes = require('./routes/user.routes');
const walletRoutes = require('./routes/wallet.routes');
const landRoutes = require('./routes/land.routes');
const loanRoutes = require('./routes/loan.routes');
const systemRoutes = require('./routes/system.routes');
const advancedRoutes = require('./routes/advanced.routes');
const errorHandler = require('./middleware/error.middleware');

const { checkConnection } = require('./config/database');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
// Disable CSP only for /api-docs — Helmet blocks Swagger's inline bootstrap script by default
app.use('/api-docs', (req, res, next) => {
  res.setHeader('Content-Security-Policy', '');
  next();
}, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Unity Compatibility: Direct Swagger JSON access
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - System
 *     summary: Health Check
 *     description: Returns the status of the server and the database connection.
 *     responses:
 *       200:
 *         description: Server is up and running.
 */
app.get('/health', async (req, res) => {
  const isDbConnected = await checkConnection();
  res.status(200).json({
    status: 'UP',
    database: isDbConnected ? 'CONNECTED' : 'DISCONNECTED',
    timestamp: new Date()
  });
});

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - System
 *     summary: Root Endpoint
 *     description: Returns a simple welcome message.
 *     responses:
 *       200:
 *         description: Success
 */
app.get('/', (req, res) => {
  res.send('FinLit Backend API - Running');
});

// Routes
app.use('/api/auth', authRoutes); // public — register & login (returns userId)

// Protected routes — require X-User-Id header
const { protect } = require('./middleware/auth.middleware');

app.use('/api/market', protect, marketRoutes);
app.use('/api/users', protect, userRoutes);
app.use('/api/wallet', protect, walletRoutes);
app.use('/api/lands', protect, landRoutes);
app.use('/api/loans', protect, loanRoutes);
app.use('/api/system', protect, systemRoutes);
app.use('/api/advanced', protect, advancedRoutes);

// Error Handling
app.use(errorHandler);

module.exports = app;
