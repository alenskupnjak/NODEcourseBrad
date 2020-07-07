const express = require('express');
const { register } = require('../controllers/authCtrl');
const bcrypt = require('bcrypt');

const router = express.Router();





// dohvati sve
router.route('/register').post(register);


module.exports = router;
