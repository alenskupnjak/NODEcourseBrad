const express = require('express');

const viewCtrl = require('../controllers/viewCtrl');
const Bootcamp = require('../models/BootcampsMod');
const advancedResults = require('../middleware/advancedResults');

const { protect } = require('../middleware/auth');

const router = express.Router();
// PATH /api/v1/view
router.route('/index').get(advancedResults(Bootcamp, 'courses'),viewCtrl.getIndex);
router.route('/login').get(advancedResults(Bootcamp, 'courses'),viewCtrl.login);
router.route('/register').get(advancedResults(Bootcamp, 'courses'),viewCtrl.register);
router.route('/forgotpassword').get(advancedResults(Bootcamp, 'courses'),viewCtrl.forgotpassword);
router.route('/manage-bootcamp').get(protect,advancedResults(Bootcamp, 'courses'),viewCtrl.manageBootcamp);
router.route('/manage-account').get(protect,advancedResults(Bootcamp, 'courses'),viewCtrl.manageAccount);
router.route('/update-password').get(protect,advancedResults(Bootcamp, 'courses'),viewCtrl.updatePassword);
router.route('/manage-reviews').get(protect,advancedResults(Bootcamp, 'courses'),viewCtrl.manageReviews);


module.exports = router;
