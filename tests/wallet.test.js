const { apiGet, apiPost, logResult } = require('./testHelper');

// Seed user IDs (from seedData.js)
const FARMER_ID = 1;

async function testWallet() {
  console.log('\nTesting Wallet API...');

  // 1. Get Wallet
  const wallet = await apiGet('/wallet', FARMER_ID);
  logResult('Get Wallet Balance', wallet.success && wallet.data.balance !== undefined, wallet);

  // 2. Get Transactions
  const txns = await apiGet('/wallet/transactions', FARMER_ID);
  logResult('Get Transaction History', txns.success, txns);

  // 3. Transfer (to user 2)
  const transfer = await apiPost('/wallet/transfer', {
    recipientId: 2,
    amount: '10.00',
    reason: 'Test Transfer'
  }, FARMER_ID);
  logResult('Transfer Funds', transfer.success, transfer);
}

testWallet();
