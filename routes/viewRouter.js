const express = require('express');

const viewCtrl = require('../controllers/viewCtrl');
const Bootcamp = require('../models/BootcampsMod');
const advancedResults = require('../middleware/advancedResults');


const router = express.Router();
// dohvati sve
router.route('/index').get(advancedResults(Bootcamp, 'courses'),viewCtrl.getIndex);
router.route('/login').get(advancedResults(Bootcamp, 'courses'),viewCtrl.login);
router.route('/register').get(advancedResults(Bootcamp, 'courses'),viewCtrl.register);
router.route('/forgotpassword').get(advancedResults(Bootcamp, 'courses'),viewCtrl.forgotpassword);
router.route('/manage-bootcamp').get(advancedResults(Bootcamp, 'courses'),viewCtrl.manageBootcamp);


module.exports = router;
