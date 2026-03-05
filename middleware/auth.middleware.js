const { User, Role } = require('../models');

/**
 * User Identification Middleware (No JWT)
 * 
 * Reads X-User-Id from the request header and loads the user from the database.
 * This replaces JWT authentication for the game client.
 * 
 * Usage: Client sends header: X-User-Id: 1
 */
exports.protect = async (req, res, next) => {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: { code: 'NO_USER_ID', message: 'X-User-Id header is required' },
    });
  }

  try {
    const user = await User.findByPk(userId, {
      include: [{ model: Role, as: 'role' }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: `User with id ${userId} not found` },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 'USER_LOAD_FAILED', message: error.message },
    });
  }
};

// authorize is a no-op — role-based access can be added later if needed
exports.authorize = (...roles) => (req, res, next) => next();
