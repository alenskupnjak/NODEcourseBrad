const express = require('express');

const viewCtrl = require('../controllers/viewCtrl');
const Bootcamp = require('../models/BootcampsMod');
const advancedResults = require('../middleware/advancedResults');

const { protect } = require('../middleware/auth');

const router = express.Router();
// PATH /api/v1/view
router
  .route('/index')
  .get(advancedResults(Bootcamp, 'courses'), viewCtrl.getIndex);
router
  .route('/login')
  .get(advancedResults(Bootcamp, 'courses'), viewCtrl.login);
router
  .route('/register')
  .get(advancedResults(Bootcamp, 'courses'), viewCtrl.register);
router
  .route('/forgotpassword')
  .get(advancedResults(Bootcamp, 'courses'), viewCtrl.forgotpassword);
router
  .route('/manage-bootcamp')
  .get(protect, advancedResults(Bootcamp, 'courses'), viewCtrl.manageBootcamp);
router
  .route('/manage-account')
  .get(protect, advancedResults(Bootcamp, 'courses'), viewCtrl.manageAccount);

router
  .route('/update-password')
  .get(protect, advancedResults(Bootcamp, 'courses'), viewCtrl.updatePassword);

router
  .route('/add-reviews/:id')
  .post(protect, advancedResults(Bootcamp, 'courses'), viewCtrl.addReview)
  .get(protect, advancedResults(Bootcamp, 'courses'), viewCtrl.addReview);

router
  .route('/error')
  .get(protect, viewCtrl.postError)
  .post(protect, viewCtrl.postError);

router
  .route('/errorNemaOvlasti')
  .get(protect, viewCtrl.errorNemaOvlasti)

module.exports = router;
