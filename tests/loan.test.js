const { apiPost, apiGet, logResult } = require('./testHelper');

async function testLoan() {
  console.log('Testing Loan API...');
  
  const login = await apiPost('/auth/login', { email: 'adult@test.com', password: 'password123' });
  if (!login.success) return;
  const token = login.data.token;

  // 1. Get Loans
  const loans = await apiGet('/loans', token);
  logResult('Get User Loans', loans.success && Array.isArray(loans.data), loans);

  // 2. Apply for Loan
  const app = await apiPost('/loans/apply', {
    lenderType: 'formal',
    principal: '5000.00',
    interestRate: '10.0',
    tenureMonths: 12
  }, token);
  logResult('Apply for Loan', app.success || app.error.message.includes('already has'), app);
}

testLoan();
