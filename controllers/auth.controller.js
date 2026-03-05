const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    console.log("req.body", req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { code: 'REGISTRATION_FAILED', message: error.message },
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, userId } = await authService.login(email, password);
    res.status(200).json({
      success: true,
      message: 'Login successful. Use the returned userId as X-User-Id header for all subsequent requests.',
      data: { user, userId, role: user.role.role_key },
    });
    console.log("user", user.role.role_key);
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { code: 'AUTH_FAILED', message: error.message },
    });
  }
};
