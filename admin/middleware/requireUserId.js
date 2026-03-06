const { Knexgame } = require('../config/db_config');

/**
 * Middleware requiring a logged user id for requests.
 * Accepts user id in header `x-user-id`, or `user_id` in body or query.
 * Skips paths in the whitelist (login/register, swagger).
 */
module.exports = async function requireUserId(req, res, next) {
  try {
    const whitelist = [
      '/api-docs', '/swagger.json', '/admin/users/login', '/admin/users/register'
    ];
    const fullPath = req.originalUrl || `${req.baseUrl || ''}${req.path || ''}`;

    // allow any path that starts with a whitelist entry
    for (const w of whitelist) {
      if (req.path === w || req.path.startsWith(w) || fullPath === w || fullPath.startsWith(w)) return next();
    }

    const header = req.get('x-user-id') || req.get('x-user') || '';
    let userId = header || (req.body && req.body.user_id) || (req.query && req.query.user_id) || null;
    if (!userId) return res.status(401).json({ message: 'user_id required (x-user-id header or user_id param)' });

    // Normalize to number when possible
    if (typeof userId === 'string' && /^[0-9]+$/.test(userId)) userId = parseInt(userId, 10);

    const user = await Knexgame('users').where({ id: userId }).first();
    if (!user) return res.status(401).json({ message: 'Invalid user_id' });

    // attach minimal user info to request
    req.user = { id: user.id, email: user.email, username: user.username };
    next();
  } catch (err) {
    console.error('requireUserId error:', err.message);
    res.status(500).json({ message: 'Auth middleware error' });
  }
};
