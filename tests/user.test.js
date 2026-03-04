const { apiPost, apiGet, apiPatch, logResult } = require('./testHelper');

async function testUser() {
  console.log('Testing User API...');
  
  // Login first to get token
  const login = await apiPost('/auth/login', { email: 'farmer@test.com', password: 'password123' });
  if (!login.success) {
    console.log('Skipping User tests: Could not login (Ensure seed script was run)');
    return;
  }
  const token = login.data.token;

  // 1. Get Me
  const me = await apiGet('/users/me', token);
  logResult('Get Current User Profile', me.success && !!me.data.profile, me);

  // 2. Update Profile
  const update = await apiPatch('/users/me', { username: 'UpdatedName' }, token);
  logResult('Update Profile', update.success, update);
}

testUser();
