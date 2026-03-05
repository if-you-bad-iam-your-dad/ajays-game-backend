const { IdempotencyKey } = require('../models');

/**
 * Middleware to handle Idempotency-Key headers
 * Prevents duplicate processing of the same request
 */
const idempotency = async (req, res, next) => {
  const key = req.headers['idempotency-key'];
  
  // Skip if no key provided or if it's not a write operation
  if (!key || ['GET', 'HEAD', 'OPTIONS', 'DELETE'].includes(req.method)) {
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

    // Capture the original send to save the response
    const originalSend = res.send;
    res.send = function (body) {
      // Only cache successful responses (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const responseBody = JSON.parse(body);
          IdempotencyKey.create({
            idempotency_key: key,
            user_id: req.user.id,
            request_path: req.originalUrl,
            response_code: res.statusCode,
            response_body: responseBody
          }).catch(err => console.error('Failed to save idempotency key:', err));
        } catch (e) {
          // If not JSON, we don't cache it for now or just skip
        }
      }
      
      return originalSend.call(this, body);
    };

    next();
  } catch (error) {
    console.error('Idempotency middleware error:', error);
    next();
  }
};

module.exports = idempotency;
