const { Router } = require('express');
const advancedController = require('../controllers/advanced.controller');
const { protect } = require('../middleware/auth.middleware');

const router = Router();

/**
 * @openapi
 * /api/advanced/insurance/buy:
 *   post:
 *     tags: [Advanced]
 *     summary: Buy an insurance policy
 *     security: [{ bearerAuth: [] }]
 */
router.post('/insurance/buy', advancedController.buyInsurance);

/**
 * @openapi
 * /api/advanced/invest:
 *   post:
 *     tags: [Advanced]
 *     summary: Create an investment (SIP/Bond)
 *     security: [{ bearerAuth: [] }]
 */
router.post('/invest', advancedController.invest);

/**
 * @openapi
 * /api/advanced/groups/join:
 *   post:
 *     tags: [Advanced]
 *     summary: Join a SHG or Co-op group
 *     security: [{ bearerAuth: [] }]
 */
router.post('/groups/join', advancedController.joinGroup);

/**
 * @openapi
 * /api/advanced/budget:
 *   post:
 *     tags: [Advanced]
 *     summary: Set or update a monthly budget category
 *     security: [{ bearerAuth: [] }]
 */
router.post('/budget', advancedController.setBudget);

module.exports = router;
