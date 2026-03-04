const { apiPost, apiGet, logResult } = require('./testHelper');

async function testMarket() {
  console.log('Testing Market API...');
  
  const login = await apiPost('/auth/login', { email: 'farmer@test.com', password: 'password123' });
  if (!login.success) return;
  const token = login.data.token;

  // 1. Get Listings
  const listings = await apiGet('/market/listings', token);
  logResult('Get Market Listings', listings.success && Array.isArray(listings.data), listings);

  // 2. Create Listing
  const newListing = await apiPost('/market/listings', {
    itemType: 'crop',
    itemId: 1,
    quantity: '10.00',
    pricePerUnit: '25.00'
  }, token);
  logResult('Create Market Listing', newListing.success, newListing);
}

testMarket();
