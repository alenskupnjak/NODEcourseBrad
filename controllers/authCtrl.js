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

    //šaljemo token
    sendTokenResponse(user, 200, res);
  } catch (error) {
    return next(new ErrorResponse(error, 400));
  }
};

//
//
// @desc      LOGIN user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(new ErrorResponse('Molim unesite email i password', 400));
    }

    // Check for user
    const user = await User.findOne({ email: email }).select('+password');

    // ako nema usera u bazi javlja grešku
    if (!user) {
      return next(new ErrorResponse('Invalid Credentials', 401));
    } else {
      console.log('Pronašao sam Usera'.green);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid password', 401));
    } else {
      console.log('Provjerio sam password i on je OK'.green);
    }

    // svi uvijet zadovoljeni, logiramo se, šaljemo token
    sendTokenResponse(user, 200, res);
  } catch (error) {
    return next(new ErrorResponse(error, 400));
  }
};

//
//TOKEN
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    console.log('production'.green);
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token: token,
  });
};


// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = async (req, res, next) => {
  try {
    console.log('getme'.green,req.user);
    
    const user = await User.findById(req.user.id);
  
    res.status(200).json({
      success: true,
      data: user
    });
    
  } catch (error) {
    return next(new ErrorResponse(error, 400));
  }
};
