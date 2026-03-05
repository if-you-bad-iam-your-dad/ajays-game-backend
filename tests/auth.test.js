const { apiPost, logResult } = require('./testHelper');

async function testAuth() {
  console.log('\nTesting User Registration API...');

  const email = `test_${Date.now()}@example.com`;

  // Register (no auth needed)
  const reg = await apiPost('/auth/register', {
    username: `user_${Date.now()}`,
    email,
    password: 'password123',
    role_key: 'farmer'
  });
  logResult('Registration', reg.success, reg);
}

testAuth();
