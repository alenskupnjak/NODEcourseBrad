const express = require('express');
const { register, login } = require('../controllers/authCtrl');
const bcrypt = require('bcryptjs');

const router = express.Router();





// dohvati sve
router.route('/register').post(register);
router.route('/login').post(login);


module.exports = router;
