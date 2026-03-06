const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmer.contoller');

router.get('/', farmerController.getFarmers);

module.exports = router;
