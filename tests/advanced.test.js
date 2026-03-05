const { apiPost, logResult } = require('./testHelper');

// Use FARMER_ID who has seeded balance
const FARMER_ID = 1;

async function testAdvanced() {
  console.log('\nTesting Advanced Features API...');

  // 1. Set Budget
  const budget = await apiPost('/advanced/budget', {
    category: 'Education',
    allocatedAmount: '5000.00'
  }, FARMER_ID);
  logResult('Set Budget', budget.success, budget);

  // 2. Invest
  const invest = await apiPost('/advanced/invest', {
    productType: 'sip',
    amount: '100.00',
    maturityDate: '2027-01-01'
  }, FARMER_ID);
  logResult('Create Investment', invest.success, invest);

  // 3. Buy Insurance — may fail if past midpoint, that is valid
  const insurance = await apiPost('/advanced/insurance/buy', {
    cropId: 1,
    seasonId: 1,
    coverAmount: '10000.00',
    premium: '500.00'
  }, FARMER_ID);
  const insuranceError = typeof insurance.error === 'string' ? insurance.error : '';
  logResult('Buy Insurance Policy', insurance.success || insuranceError.includes('midpoint') || insuranceError.includes('already'), insurance);
}

testAdvanced();
