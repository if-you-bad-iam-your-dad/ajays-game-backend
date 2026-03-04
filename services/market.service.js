const { MarketListing, MarketTransaction, Inventory, UserWallet, sequelize } = require('../models');
const walletService = require('./wallet.service');

class MarketService {
  /**
   * Get all active listings with filters
   */
  async getListings(filters = {}) {
    const where = { status: 'active' };
    if (filters.itemType) where.item_type = filters.itemType;

    return await MarketListing.findAll({
      where,
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Create a new market listing
   * Locks inventory from the seller
   */
  async createListing(sellerId, listingData) {
    const { itemType, itemId, quantity, pricePerUnit, saleType } = listingData;
    const qtyFloat = parseFloat(quantity);

    const t = await sequelize.transaction();

    try {
      // 1. Check and lock inventory
      const inventory = await Inventory.findOne({
        where: { user_id: sellerId, item_type: itemType, item_id: itemId },
        lock: t.LOCK.UPDATE,
        transaction: t
      });

      if (!inventory || parseFloat(inventory.quantity) < qtyFloat) {
        throw new Error('Insufficient inventory to create listing');
      }

      // 2. Subtract from inventory
      inventory.quantity = parseFloat(inventory.quantity) - qtyFloat;
      await inventory.save({ transaction: t });

      // 3. Create listing
      const listing = await MarketListing.create({
        seller_id: sellerId,
        item_type: itemType,
        item_id: itemId,
        quantity: qtyFloat,
        remaining_qty: qtyFloat,
        price_per_unit: pricePerUnit,
        sale_type: saleType || 'open',
        status: 'active'
      }, { transaction: t });

      await t.commit();
      return listing;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Execute a purchase from a listing
   * Atomic transaction between buyer and seller
   */
  async buyItem(buyerId, listingId, { qty, offerPrice }) {
    const qtyFloat = parseFloat(qty);
    const priceFloat = parseFloat(offerPrice);

    const t = await sequelize.transaction();

    try {
      // 1. Get and lock listing
      const listing = await MarketListing.findByPk(listingId, {
        lock: t.LOCK.UPDATE,
        transaction: t
      });

      if (!listing || listing.status !== 'active') throw new Error('Listing not active');
      if (parseFloat(listing.remaining_qty) < qtyFloat) throw new Error('Insufficient quantity available');
      if (parseFloat(listing.price_per_unit) !== priceFloat) throw new Error('Price has changed');

      const totalAmount = qtyFloat * priceFloat;

      // 2. Financial Transfer (using walletService logic within this transaction)
      // Debit Buyer
      await walletService.addTransaction({
        userId: buyerId,
        amount: -totalAmount,
        txnType: 'MARKET_PURCHASE',
        referenceId: listing.id,
        transaction: t
      });

      // Credit Seller
      await walletService.addTransaction({
        userId: listing.seller_id,
        amount: totalAmount,
        txnType: 'MARKET_SALE',
        referenceId: listing.id,
        transaction: t
      });

      // 3. Update Listing
      listing.remaining_qty = parseFloat(listing.remaining_qty) - qtyFloat;
      if (parseFloat(listing.remaining_qty) <= 0) {
        listing.status = 'sold';
      }
      await listing.save({ transaction: t });

      // 4. Update Buyer Inventory
      let buyerInventory = await Inventory.findOne({
        where: { user_id: buyerId, item_type: listing.item_type, item_id: listing.item_id },
        lock: t.LOCK.UPDATE,
        transaction: t
      });

      if (buyerInventory) {
        buyerInventory.quantity = parseFloat(buyerInventory.quantity) + qtyFloat;
        await buyerInventory.save({ transaction: t });
      } else {
        await Inventory.create({
          user_id: buyerId,
          item_type: listing.item_type,
          item_id: listing.item_id,
          quantity: qtyFloat,
          quality: 'Standard'
        }, { transaction: t });
      }

      // 5. Record Transaction
      const marketTxn = await MarketTransaction.create({
        listing_id: listing.id,
        buyer_id: buyerId,
        seller_id: listing.seller_id,
        quantity: qtyFloat,
        unit_price: priceFloat,
        total_amount: totalAmount
      }, { transaction: t });

      await t.commit();
      return marketTxn;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = new MarketService();
