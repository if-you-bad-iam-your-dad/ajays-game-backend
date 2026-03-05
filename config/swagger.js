const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const { version } = require('../package.json');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FinLit Backend API Documentation',
      version,
      description: 'Interactive API documentation for the FinLit real-time macroeconomic simulation engine.',
      contact: {
        name: 'API Support',
        url: 'https://github.com/your-repo/finlit',
      },
    },
    servers: [
      {
        url: '/',
        description: 'Current Host (Dynamic)',
      },
      {
        url: 'http://localhost:5000',
        description: 'Development Server (Localhost)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        BaseResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' },
                details: { type: 'object' },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64' },
            username: { type: 'string' },
            email: { type: 'string' },
            role_id: { type: 'integer' },
            status: { type: 'string', enum: ['active', 'suspended', 'deleted'] },
          },
        },
        UserProfile: {
          type: 'object',
          properties: {
            user_id: { type: 'integer', format: 'int64' },
            credit_trust: { type: 'integer' },
            fr_score: { type: 'integer' },
            stress_index: { type: 'integer' },
            reputation_score: { type: 'integer' },
            digital_confidence: { type: 'integer' },
            scam_awareness: { type: 'integer' },
            smart_decision_rate: { type: 'integer' },
          },
        },
        Wallet: {
          type: 'object',
          properties: {
            user_id: { type: 'integer', format: 'int64' },
            balance: { type: 'string', example: '1000.00' },
            reserved_balance: { type: 'string', example: '0.00' },
          },
        },
        Season: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            status: { type: 'string', enum: ['active', 'completed', 'upcoming'] },
            monsoon_strength: { type: 'string', example: '1.00' },
          },
        },
        Crop: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            base_yield: { type: 'string' },
            base_price: { type: 'string' },
          },
        },
        Seed: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            crop_id: { type: 'integer' },
            name: { type: 'string' },
            yield_multiplier: { type: 'string' },
            cost: { type: 'string' },
          },
        },
        Land: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64' },
            user_id: { type: 'integer', format: 'int64' },
            area: { type: 'string' },
            land_type: { type: 'string' },
            status: { type: 'string' },
          },
        },
        FarmPlan: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64' },
            user_id: { type: 'integer', format: 'int64' },
            land_id: { type: 'integer', format: 'int64' },
            season_id: { type: 'integer' },
            crop_id: { type: 'integer' },
            seed_id: { type: 'integer' },
            area_allocated: { type: 'string' },
            planned_yield: { type: 'string' },
            status: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path.resolve(__dirname, '../app.js'),
    path.resolve(__dirname, '../routes/*.js'),
    path.resolve(__dirname, '../models/*.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
