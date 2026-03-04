const marketService = require('../services/market.service');

exports.getListings = async (req, res) => {
  try {
    const listings = await marketService.getListings(req.query);
    res.status(200).json({
      success: true,
      data: listings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { code: 'LISTINGS_FETCH_FAILED', message: error.message },
    });
  }
};

exports.createListing = async (req, res) => {
  try {
    const listing = await marketService.createListing(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Market listing created successfully',
      data: listing,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { code: 'LISTING_CREATION_FAILED', message: error.message },
    });
  }
};

exports.buyItem = async (req, res) => {
  try {
    const transaction = await marketService.buyItem(req.user.id, req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Purchase successful',
      data: transaction,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { code: 'PURCHASE_FAILED', message: error.message },
    });
  }
};
