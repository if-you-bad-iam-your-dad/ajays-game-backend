const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

router.get('/', usersController.getUsers);

router.post('/register', usersController.registerUser);

router.post('/login', usersController.loginUser);
router.get('/roles', usersController.getroles);

module.exports = router;
