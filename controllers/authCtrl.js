const User = require('../models/UserMod');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    //Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      sucess: true,
      token: token,
      Registracija: 'Prošla',
    });
  } catch (error) {
    return next(new ErrorResponse(error, 400));
  }
};

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password.red);

    // Validate email & password
    if (!email || !password) {
      return next(new ErrorResponse('Molim unesite email i password', 400));
    }

    // Check for user
    const user = await User.findOne({ email: email }).select('+password');

    // ako nema usera u bazi javlja grešku
    if (!user) {
      return next(new ErrorResponse('Invalid Credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid password', 401));
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      sucess: true,
      token:token
    });
  } catch (error) {
    return next(new ErrorResponse(error, 400));
  }
};
