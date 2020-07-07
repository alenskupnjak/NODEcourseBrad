const User = require('../models/UserMod');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = async (req, res, next) => {
  try {
    res.status(200).json({ success: true });
    console.log('register'.red);
    
  } catch (error) {
    return next(new ErrorResponse('Greška kod registracije',400))
  }
};
