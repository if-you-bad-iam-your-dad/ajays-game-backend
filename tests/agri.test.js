const { apiGet, apiPost, logResult } = require('./testHelper');

// Seed user IDs (from seedData.js)
const FARMER_ID = 1;
const ADULT_ID = 4;

async function testAgri() {
  console.log('\nTesting Agriculture API...');

  // 1. Get Lands
  const lands = await apiGet('/lands', FARMER_ID);
  logResult('Get Lands', lands.success && Array.isArray(lands.data), lands);

  // 2. Get Active Season
  const season = await apiGet('/lands/seasons/active', FARMER_ID);
  logResult('Get Active Season', season.success, season);

  // 3. Create Farm Plan (if lands and season exist)
  if (lands.success && Array.isArray(lands.data) && lands.data.length > 0 && season.success && season.data) {
    const plan = await apiPost('/lands/farm-plans', {
      landId: lands.data[0].id,
      seasonId: season.data.id,
      cropId: 1,
      seedId: 1,
      areaAllocated: '2.5'
    }, FARMER_ID);
    logResult('Create Farm Plan', plan.success, plan);
  } else {
    console.log('  ⚠️  SKIP: Create Farm Plan (no active season or lands found)');
  }
}

testAgri();
