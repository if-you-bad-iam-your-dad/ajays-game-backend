const bcrypt = require('bcryptjs');
const { User, Role, UserProfile, UserWallet, sequelize } = require('../models');

class AuthService {
  async register(userData) {
    const { username, email, password, role_key } = userData;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Find role
    const role = await Role.findOne({ where: { role_key } });
    if (!role) {
      throw new Error('Invalid role specified');
    }

    const transaction = await sequelize.transaction();

    try {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Create user
      const user = await User.create({
        username,
        email,
        password_hash,
        role_id: role.id,
      }, { transaction });

      // Initialize profile
      await UserProfile.create({ user_id: user.id }, { transaction });

      // Initialize wallet with starting balance
      await UserWallet.create({
        user_id: user.id,
        balance: 1000.00,
      }, { transaction });

      await transaction.commit();

      const { password_hash: _, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Login now returns userId instead of a JWT token
  async login(email, password) {
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role', attributes: ['role_key', 'description'] }]
    });

    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error('Invalid credentials');

    const { password_hash: _, ...userWithoutPassword } = user.toJSON();
    // Return userId so the client can use it as X-User-Id header going forward
    return { user: userWithoutPassword, userId: user.id };
  }
}

module.exports = new AuthService();
