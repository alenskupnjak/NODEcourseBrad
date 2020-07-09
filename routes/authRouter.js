const express = require('express');
const { register, login, getMe } = require('../controllers/authCtrl');
const bcrypt = require('bcryptjs');

const router = express.Router();

// štiti rute od neulogiranih usera
const { protect } = require('../middleware/auth');

// dohvati sve
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect,getMe);

module.exports = router;
