const { apiGet, apiPatch, logResult } = require('./testHelper');

// Seed user IDs (from seedData.js)
const FARMER_ID = 1;

async function testUser() {
  console.log('\nTesting User API...');

  // 1. Get Me
  const me = await apiGet('/users/me', FARMER_ID);
  logResult('Get Current User Profile', me.success && !!me.data, me);

  // 2. Update Profile
  const update = await apiPatch('/users/me', { username: 'UpdatedFarmer' }, FARMER_ID);
  logResult('Update Profile', update.success, update);
}

testUser();
