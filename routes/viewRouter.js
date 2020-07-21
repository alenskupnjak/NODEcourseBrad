const express = require('express');

const viewCtrl = require('../controllers/viewCtrl');
const Bootcamp = require('../models/BootcampsMod');
const advancedResults = require('../middleware/advancedResults');


const router = express.Router();
// dohvati sve
router.route('/index').get(advancedResults(Bootcamp, 'courses'),viewCtrl.getIndex);
router.route('/login').get(advancedResults(Bootcamp, 'courses'),viewCtrl.login);


module.exports = router;
