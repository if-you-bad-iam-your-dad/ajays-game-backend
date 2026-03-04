exports.getMe = async (req, res) => {
  res.json({ success: true, data: { username: 'testuser', role: 'farmer' } });
};

exports.updateMe = async (req, res) => {
  res.json({ success: true, message: 'Profile updated' });
};
