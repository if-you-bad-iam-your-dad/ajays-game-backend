const { apiPost, logResult } = require('./testHelper');

async function testAuth() {
  console.log('Testing Authentication API...');
  
  const email = `test_${Date.now()}@example.com`;
  
  // 1. Register
  const reg = await apiPost('/auth/register', {
    username: `user_${Date.now()}`,
    email,
    password: 'password123',
    role_key: 'farmer'
  });
  logResult('Registration', reg.success, reg);

  // 2. Login
  const login = await apiPost('/auth/login', { email, password: 'password123' });
  logResult('Login', login.success && !!login.data.token, login);
}

testAuth();
