const express = require('express');
const authController = require('../controllers/authCtrl');
const logger = require('../middleware/logger');

const router = express.Router();

// štiti SVE rute odavde nadalje od neulogiranih usera
const { protect } = require('../middleware/auth');

// dohvati sve
router.route('/register').post(authController.register);
router.route('/login').post(authController.login);
router.get('/logout', authController.logout);
router.route('/me').get(protect, authController.getMe);
router
  .route('/updateuserdetails')
  .post(protect, authController.updateUserDetails);
router.route('/updatepassword').post(protect, authController.updatePassword);
router.put('/resetpassword/:resettoken', authController.resetPassword);
router.post('/resetpassword/:resettoken', authController.resetPassword);
router.get('/resetpassword/:resettoken', authController.getResetPassword);
router.route('/forgotpassword').post(authController.forgotpassword);

module.exports = router;
