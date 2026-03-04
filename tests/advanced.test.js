const { apiPost, logResult } = require('./testHelper');

async function testAdvanced() {
  console.log('Testing Advanced Features API...');
  
  const login = await apiPost('/auth/login', { email: 'woman@test.com', password: 'password123' });
  if (!login.success) return;
  const token = login.data.token;

  // 1. Set Budget
  const budget = await apiPost('/advanced/budget', {
    category: 'Education',
    allocatedAmount: '5000.00'
  }, token);
  logResult('Set Budget', budget.success, budget);

  // 2. Invest
  const invest = await apiPost('/advanced/invest', {
    productType: 'sip',
    amount: '1000.00',
    maturityDate: '2027-01-01'
  }, token);
  logResult('Create Investment', invest.success, invest);

  // 3. Buy Insurance
  const insurance = await apiPost('/advanced/insurance/buy', {
    cropId: 1,
    seasonId: 1,
    coverAmount: '10000.00',
    premium: '500.00'
  }, token);
  logResult('Buy Insurance Policy', insurance.success || insurance.error.message.includes('midpoint'), insurance);
}

testAdvanced();
