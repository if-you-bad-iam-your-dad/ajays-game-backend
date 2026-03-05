const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const { version } = require('../package.json');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FinLit Backend API Documentation',
      version,
      description: `
## Authentication

JWT has been removed. All protected endpoints use a simple **X-User-Id** header.

**Flow:**
1. Call \`POST /api/auth/login\` — returns \`userId\`
2. Pass that \`userId\` as the \`X-User-Id\` header in all subsequent requests

**Example:**
\`\`\`
X-User-Id: 1
\`\`\`

Public endpoints (no header needed): \`GET /\`, \`GET /health\`, \`POST /api/auth/register\`, \`POST /api/auth/login\`, \`GET /api/system/game-state\`
      `,
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
    ],
    components: {
      securitySchemes: {
        UserIdAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-User-Id',
          description: 'Pass the userId returned from POST /api/auth/login',
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
            liquid_assets: { type: 'string', example: '0.00' },
            investment_value: { type: 'string', example: '0.00' },
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
        WalletTransaction: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64' },
            user_id: { type: 'integer', format: 'int64' },
            txn_type: { type: 'string' },
            amount: { type: 'string' },
            balance_before: { type: 'string' },
            balance_after: { type: 'string' },
            reason_code: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Season: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            season_number: { type: 'integer' },
            status: { type: 'string', enum: ['active', 'completed'] },
            monsoon_strength: { type: 'string', example: '1.00' },
            start_time: { type: 'string', format: 'date-time' },
            end_time: { type: 'string', format: 'date-time' },
          },
        },
        Crop: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            base_yield: { type: 'string' },
            base_market_price: { type: 'string' },
            risk_category: { type: 'string', enum: ['low', 'medium', 'high'] },
          },
        },
        Seed: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            crop_id: { type: 'integer' },
            quality: { type: 'string', enum: ['low', 'medium', 'high'] },
            yield_multiplier: { type: 'string' },
            cost_per_unit: { type: 'string' },
          },
        },
        Land: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64' },
            user_id: { type: 'integer', format: 'int64' },
            total_area: { type: 'string' },
            soil_quality: { type: 'string', enum: ['low', 'medium', 'high'] },
            irrigation_level: { type: 'integer' },
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
            yield_factor: { type: 'string' },
            status: { type: 'string', enum: ['planned', 'harvested', 'failed'] },
          },
        },
        Loan: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64' },
            user_id: { type: 'integer', format: 'int64' },
            lender_type: { type: 'string', enum: ['formal', 'informal', 'shg', 'microfinance'] },
            principal: { type: 'string' },
            interest_rate: { type: 'string' },
            tenure_months: { type: 'integer' },
            remaining_balance: { type: 'string' },
            default_count: { type: 'integer' },
            status: { type: 'string', enum: ['active', 'completed', 'defaulted'] },
          },
        },
        MarketListing: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64' },
            seller_id: { type: 'integer', format: 'int64' },
            item_type: { type: 'string', enum: ['crop', 'product'] },
            item_id: { type: 'integer' },
            quantity: { type: 'string' },
            remaining_qty: { type: 'string' },
            price_per_unit: { type: 'string' },
            sale_type: { type: 'string', enum: ['open', 'consignment'] },
            status: { type: 'string', enum: ['active', 'sold', 'cancelled'] },
          },
        },
        Enterprise: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64' },
            user_id: { type: 'integer', format: 'int64' },
            name: { type: 'string' },
            enterprise_type: { type: 'string' },
            revenue: { type: 'string' },
            costs: { type: 'string' },
            tax_due: { type: 'string' },
            status: { type: 'string', enum: ['active', 'bankrupt', 'closed'] },
          },
        },
        EconomicState: {
          type: 'object',
          properties: {
            inflation_rate: { type: 'string' },
            monsoon_strength: { type: 'string' },
            rural_credit_modifier: { type: 'string' },
            fraud_index: { type: 'string' },
            agri_subsidy_modifier: { type: 'string' },
            investment_market_volatility: { type: 'string' },
            digital_fraud_index: { type: 'string' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    // Apply X-User-Id to all routes by default; override per-route if public
    security: [
      { UserIdAuth: [] },
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
