const { IdempotencyKey } = require('../models');

/**
 * Middleware to handle Idempotency-Key headers
 * Prevents duplicate processing of the same request
 */
const idempotency = async (req, res, next) => {
  const key = req.headers['idempotency-key'];
  
  // Skip if no key provided or if it's not a write operation
  if (!key || ['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Ensure user is authenticated (should be placed after auth middleware)
  if (!req.user) {
    return next();
  }

  try {
    const existing = await IdempotencyKey.findOne({
      where: {
        idempotency_key: key,
        user_id: req.user.id,
        request_path: req.originalUrl
      }
    });

    if (existing) {
      return res.status(existing.response_code || 200).json({
        ...existing.response_body,
        _idempotent: true,
        _original_request_at: existing.created_at
      });
    }

    // Intercept res.json to save the response
    const originalJson = res.json;
    res.json = function (body) {
      // Only cache successful or client-error responses, usually 2xx and 4xx
      // But for safety, we often only cache 2xx
      if (res.statusCode >= 200 && res.statusCode < 300) {
        IdempotencyKey.create({
          idempotency_key: key,
          user_id: req.user.id,
          request_path: req.originalUrl,
          response_code: res.statusCode,
          response_body: body
        }).catch(err => console.error('Failed to save idempotency key:', err));
      }
      
      return originalJson.call(this, body);
    };

    next();
  } catch (error) {
    console.error('Idempotency middleware error:', error);
    next();
  }
};

module.exports = idempotency;
