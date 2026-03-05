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
const idempotency = require('./middleware/idempotency.middleware');
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Unity Compatibility: Direct Swagger JSON access
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
// Note: Idempotency middleware is now applied inside routes or after auth
app.use('/api/auth', authRoutes);

// Protected routes should have idempotency
const { protect } = require('./middleware/auth.middleware');
app.use(protect);
app.use(idempotency);

app.use('/api/market', marketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/lands', landRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/advanced', advancedRoutes);


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

// Error Handling
app.use(errorHandler);

module.exports = app;
