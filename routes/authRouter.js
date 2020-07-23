const express = require('express');
const bcrypt = require('bcryptjs');
const authController = require('../controllers/authCtrl');

const router = express.Router();

// štiti SVE rute odavde nadalje od neulogiranih usera
const { protect } = require('../middleware/auth');

// dohvati sve
router.route('/register').post(authController.register);
router.route('/login').post(authController.login);
router.get('/logout', authController.logout);
router.route('/me').get(protect, authController.getMe);
router.route('/updateuserdetails').put(protect, authController.updateUserDetails);
router.route('/updatepassword').put(protect, authController.updatePassword);
router.put('/resetpassword/:resettoken', authController.resetPassword);
router.route('/forgotpassword').post(authController.forgotpassword);

module.exports = router;
