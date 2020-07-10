const express = require('express');
const {
  register,
  login,
  getMe,
  forgotpassword,
  resetPassword,
  updateUserDetails,
  updatePassword
} = require('../controllers/authCtrl');
const bcrypt = require('bcryptjs');

const router = express.Router();

// štiti rute od neulogiranih usera
const { protect } = require('../middleware/auth');

// dohvati sve
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, getMe);
router.route('/updateuserdetails').put(protect, updateUserDetails);
router.route('/updatepassword').put(protect,updatePassword);
router.put('/resetpassword/:resettoken', resetPassword);

// dva načina
// router.post('/forgotpassword', forgotpassword);
// ili
router.route('/forgotpassword').post(forgotpassword);

module.exports = router;
