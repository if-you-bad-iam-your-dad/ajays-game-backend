const { apiPost, apiGet, logResult } = require('./testHelper');

async function testAgri() {
  console.log('Testing Agriculture API...');
  
  const login = await apiPost('/auth/login', { email: 'farmer@test.com', password: 'password123' });
  if (!login.success) return;
  const token = login.data.token;

  // 1. Get Lands
  const lands = await apiGet('/lands', token);
  logResult('Get Lands', lands.success && lands.data.length > 0, lands);

  // 2. Get Active Season
  const season = await apiGet('/lands/seasons/active', token);
  logResult('Get Active Season', season.success && !!season.data, season);

  // 3. Create Farm Plan
  if (lands.success && lands.data.length > 0 && season.success) {
    const plan = await apiPost('/lands/farm-plans', {
      landId: lands.data[0].id,
      seasonId: season.data.id,
      cropId: 1,
      seedId: 1,
      areaAllocated: '2.5'
    }, token);
    logResult('Create Farm Plan', plan.success, plan);
  }
}

testAgri();
