const { apiPost, apiGet, logResult } = require('./testHelper');

async function testWallet() {
  console.log('Testing Wallet API...');
  
  const login = await apiPost('/auth/login', { email: 'farmer@test.com', password: 'password123' });
  if (!login.success) return;
  const token = login.data.token;

  // 1. Get Wallet
  const wallet = await apiGet('/wallet', token);
  logResult('Get Wallet Balance', wallet.success && wallet.data.balance !== undefined, wallet);

  // 2. Get Transactions
  const txns = await apiGet('/wallet/transactions', token);
  logResult('Get Transaction History', txns.success, txns);

  // 3. Transfer
  const transfer = await apiPost('/wallet/transfer', {
    recipientId: 2,
    amount: '10.00',
    reason: 'Test Transfer'
  }, token);
  logResult('Transfer Funds', transfer.success, transfer);
}

testWallet();
