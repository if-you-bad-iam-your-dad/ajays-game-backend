const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
      // Hash password
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
      await UserProfile.create({
        user_id: user.id,
      }, { transaction });

      // Initialize wallet
      await UserWallet.create({
        user_id: user.id,
        balance: 1000.00, // Starting balance for testing
      }, { transaction });

      await transaction.commit();
      
      const { password_hash: _, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async login(email, password) {
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role' }]
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role.role_key },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const { password_hash: _, ...userWithoutPassword } = user.toJSON();
    return { user: userWithoutPassword, token };
  }
}

module.exports = new AuthService();
