const { apiGet, apiPost, logResult } = require('./testHelper');

// Seed user IDs (from seedData.js)
const FARMER_ID = 1;

async function testMarket() {
  console.log('\nTesting Market API...');

  // 1. Get Listings (no userId required — public listing view)
  const listings = await apiGet('/market/listings', FARMER_ID);
  logResult('Get Market Listings', listings.success && Array.isArray(listings.data), listings);

  // 2. Create Listing
  const newListing = await apiPost('/market/listings', {
    itemType: 'crop',
    itemId: 1,
    quantity: '10.00',
    pricePerUnit: '25.00'
  }, FARMER_ID);
  logResult('Create Market Listing', newListing.success, newListing);
}

testMarket();
