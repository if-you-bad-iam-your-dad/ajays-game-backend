const { apiPost, logResult } = require('./testHelper');

// Seed user IDs (from seedData.js)
const FARMER_ID = 1;

async function testSystem() {
  console.log('\nTesting System Engine API...');

  // 1. Game State (public, no userId needed)
  const { apiGet } = require('./testHelper');
  const gameState = await apiGet('/system/game-state', FARMER_ID);
  logResult('Get Game State', gameState.success, gameState);

  // 2. Daily Engine
  const daily = await apiPost('/system/engine/daily', {}, FARMER_ID);
  logResult('Trigger Daily Engine', daily.success, daily);

  // 3. Monthly Engine
  const monthly = await apiPost('/system/engine/monthly', {}, FARMER_ID);
  logResult('Trigger Monthly Engine', monthly.success, monthly);

  // 4. Global Events
  const events = await apiPost('/system/engine/events', {}, FARMER_ID);
  logResult('Trigger Global Events', events.success, events);
}

testSystem();
