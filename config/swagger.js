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
        url: 'http://localhost:5000',
        description: 'Development Server',
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
        Error: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            message: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            email: { type: 'string' },
            role_key: { type: 'string', enum: ['farmer', 'woman', 'student', 'young_adult'] },
          },
        },
        Wallet: {
          type: 'object',
          properties: {
            balance: { type: 'string', example: '1000.00' },
            reserved_balance: { type: 'string', example: '0.00' },
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
