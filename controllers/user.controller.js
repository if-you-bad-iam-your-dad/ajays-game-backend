const { User, UserProfile, UserWallet, Role } = require('../models');

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'status'],
      include: [
        { model: Role, as: 'role', attributes: ['role_key', 'description'] },
        { model: UserProfile, as: 'profile' },
        { model: UserWallet, as: 'wallet' }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ME_FAILED', message: error.message },
    });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByPk(req.user.id);

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { code: 'UPDATE_ME_FAILED', message: error.message },
    });
  }
};
