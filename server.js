const express = require("express");
const cors = require("cors");
const path = require('path');
require('dotenv').config();
const morgan = require('morgan');
const crypto = require('crypto');
const { Knexgame } = require('./admin/config/db_config');
const app = express();
const PORT = process.env.PORT

// Middleware
app.use(cors());
app.use(express.json());

// Development request logger (compact)
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}
// API-only request logger: logs only requests that reach mounted routers (non-blocking)
function maskSensitive(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const masked = Array.isArray(obj) ? [] : {};
    for (const [k, v] of Object.entries(obj)) {
        if (/password|passwd|pwd|token|secret/i.test(k)) masked[k] = '***REDACTED***';
        else masked[k] = (v && typeof v === 'object') ? maskSensitive(v) : v;
    }
    return masked;
}

function apiLogger(req, res, next) {
    const start = process.hrtime();
    const requestId = req.headers['x-request-id'] || (crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex'));
    const ip = req.ip || req.headers['x-forwarded-for'] || (req.connection && req.connection.remoteAddress) || null;

    res.on('finish', () => {
        try {
            const diff = process.hrtime(start);
            const durationMs = (diff[0] * 1e3) + (diff[1] / 1e6);
            const entry = {
                level: 'INFO',
                module: 'http',
                action: `${req.method} ${req.originalUrl}`,
                log: null,
                description: null,
                user_id: (req.user && req.user.id) ? req.user.id : null,
                caused_by_user: null,
                ip_address: ip,
                user_agent: req.get('User-Agent') || null,
                session_id: req.headers['x-session-id'] || null,
                request_id: requestId,
                metadata: JSON.stringify({
                    method: req.method,
                    url: req.originalUrl,
                    params: req.params || {},
                    query: req.query || {},
                    body: maskSensitive(req.body || {}),
                    status: res.statusCode,
                    response_time_ms: Math.round(durationMs)
                }),
                stack_trace: null,
            };

            Knexgame('logs').insert(entry).catch(err => {
                console.error('Failed to write request log:', err.message);
            });
        } catch (err) {
            console.error('Request log (finish) error:', err.message);
        }
    });

    next();
}

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./admin/config/swagger.json');

// Routes
const requireUserId = require('./admin/middleware/requireUserId');
const usersRoutes = require('./admin/routes/users.routes');
const farmerRoutes = require('./admin/routes/farmer.routes');
const logRoutes = require('./admin/routes/log.routes');

// Require a logged user id for all /admin routes (middleware will whitelist login/register)
app.use('/admin', requireUserId);

app.use('/admin/users', apiLogger, usersRoutes);
app.use('/admin/farmer', apiLogger, farmerRoutes);
app.use('/admin/logs', apiLogger, logRoutes);

// Serve swagger JSON at common endpoints so Swagger UI can fetch it without CORS/file issues
// Serve swagger JSON dynamically with correct host so UI works across the LAN
app.get('/swagger.json', (req, res) => {
    const doc = JSON.parse(JSON.stringify(swaggerDocument));
    const origin = `${req.protocol}://${req.get('host')}`;
    if (doc.servers && Array.isArray(doc.servers) && doc.servers.length) {
        doc.servers[0].url = origin;
    } else {
        doc.servers = [{ url: origin }];
    }
    res.json(doc);
});

app.get('/admin/config/swagger.json', (req, res) => {
    const doc = JSON.parse(JSON.stringify(swaggerDocument));
    const origin = `${req.protocol}://${req.get('host')}`;
    if (doc.servers && Array.isArray(doc.servers) && doc.servers.length) {
        doc.servers[0].url = origin;
    } else {
        doc.servers = [{ url: origin }];
    }
    res.json(doc);
});

// Swagger UI: fetch the spec from /swagger.json (ensures correct host on LAN)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, { swaggerOptions: { url: '/swagger.json' } }));

app.use('/', (req, res) => {
    res.send('Welcome to ajays game backend server');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


