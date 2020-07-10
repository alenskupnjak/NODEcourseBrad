const express = require('express');
const {
  register,
  login,
  getMe,
  forgotpassword,
  resetPassword,
} = require('../controllers/authCtrl');
const bcrypt = require('bcryptjs');

const router = express.Router();

// štiti rute od neulogiranih usera
const { protect } = require('../middleware/auth');

// dohvati sve
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, getMe);
// router.route('/resetpassword/:resettoken').put(resetPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// dva načina
// router.post('/forgotpassword', forgotpassword);
// ili
router.route('/forgotpassword').post(forgotpassword);

module.exports = router;
