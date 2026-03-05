const { apiGet, apiPost, logResult } = require('./testHelper');

// Seed user IDs (from seedData.js)
const ADULT_ID = 4;

async function testLoan() {
  console.log('\nTesting Loan API...');

  // 1. Get Loans
  const loans = await apiGet('/loans', ADULT_ID);
  logResult('Get User Loans', loans.success && Array.isArray(loans.data), loans);

  // 2. Apply for Loan
  const app = await apiPost('/loans/apply', {
    lenderType: 'formal',
    principal: '5000.00',
    interestRate: '10.0',
    tenureMonths: 12
  }, ADULT_ID);
  logResult('Apply for Loan', app.success || (app.error && app.error.message.includes('already has')), app);
}

testLoan();
