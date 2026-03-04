const { apiPost, logResult } = require('./testHelper');

async function testSystem() {
  console.log('Testing System Engine API...');
  
  const login = await apiPost('/auth/login', { email: 'farmer@test.com', password: 'password123' });
  if (!login.success) return;
  const token = login.data.token;

  // 1. Daily Engine
  const daily = await apiPost('/system/engine/daily', {}, token);
  logResult('Trigger Daily Engine', daily.success, daily);

  // 2. Monthly Engine
  const monthly = await apiPost('/system/engine/monthly', {}, token);
  logResult('Trigger Monthly Engine', monthly.success, monthly);

  // 3. Global Events
  const events = await apiPost('/system/engine/events', {}, token);
  logResult('Trigger Global Events', events.success, events);
}

testSystem();
