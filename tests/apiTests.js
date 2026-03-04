/**
 * FinLit API Integration Test Suite
 * Requirements: 
 * 1. Server must be running (npm run dev)
 * 2. DB should be seeded (node scripts/seedData.js)
 * Usage: node tests/apiTests.js
 */

const BASE_URL = 'http://localhost:5000/api';
let token = '';
let userId = null;

async function runTests() {
  console.log('🚀 Starting API Integration Tests...\n');

  try {
    // --- 1. Authentication ---
    console.log('--- Phase 1: Authentication ---');
    
    // Register
    const regRes = await apiPost('/auth/register', {
      username: `tester_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'password123',
      role_key: 'farmer'
    });
    logResult('POST /auth/register', regRes.success);

    // Login
    const loginRes = await apiPost('/auth/login', {
      email: regRes.data.email,
      password: 'password123'
    });
    token = loginRes.data.token;
    userId = loginRes.data.user.id;
    logResult('POST /auth/login', loginRes.success && !!token);

    // --- 2. Users & Profile ---
    console.log('\n--- Phase 2: Users & Profile ---');
    const profileRes = await apiGet('/users/me');
    logResult('GET /users/me', profileRes.success && profileRes.data.username.includes('tester'));

    // --- 3. Wallet & Ledger ---
    console.log('\n--- Phase 3: Wallet & Ledger ---');
    const walletRes = await apiGet('/wallet');
    logResult('GET /wallet', walletRes.success && parseFloat(walletRes.data.balance) > 0);

    const transRes = await apiGet('/wallet/transactions');
    logResult('GET /wallet/transactions', transRes.success);

    // --- 4. Agriculture ---
    console.log('\n--- Phase 4: Agriculture ---');
    const landsRes = await apiGet('/lands');
    logResult('GET /api/lands', landsRes.success);

    const seasonRes = await apiGet('/lands/seasons/active');
    logResult('GET /api/lands/seasons/active', seasonRes.success && seasonRes.data.status === 'active');

    // --- 5. Market ---
    console.log('\n--- Phase 5: Market ---');
    const listingsRes = await apiGet('/market/listings');
    logResult('GET /api/market/listings', listingsRes.success);

    // --- 6. Loans ---
    console.log('\n--- Phase 6: Loans ---');
    const myLoansRes = await apiGet('/loans');
    logResult('GET /api/loans', myLoansRes.success);

    // --- 7. System Triggers ---
    console.log('\n--- Phase 7: System Triggers ---');
    const dailyRes = await apiPost('/system/engine/daily');
    logResult('POST /system/engine/daily', dailyRes.success);

    const eventRes = await apiPost('/system/engine/events');
    logResult('POST /system/engine/events', eventRes.success);

    // --- 8. Advanced Features ---
    console.log('\n--- Phase 8: Advanced Features ---');
    const budgetRes = await apiPost('/advanced/budget', {
      category: 'Food',
      allocatedAmount: '2000.00'
    });
    logResult('POST /api/advanced/budget', budgetRes.success);

    console.log('\n✅ All API test categories completed!');
  } catch (error) {
    console.error('\n❌ Test Suite Failed:', error.message);
  }
}

// --- Helpers ---

async function apiGet(endpoint) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, { method: 'GET', headers });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function apiPost(endpoint, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function logResult(label, passed) {
  if (passed) {
    console.log(`  PASS: ${label}`);
  } else {
    console.log(`  FAIL: ${label}`);
  }
}

runTests();
