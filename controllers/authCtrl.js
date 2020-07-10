const crypto = require('crypto');
const User = require('../models/UserMod');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const bcryptjs = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');

/////////////////////////////////////////////////////////
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

/////////////////////////////////////////////////////////
// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(new ErrorResponse(error, 400));
  }
};

///////////////////////////////////////////////
// @desc      UPDATE user details
// @route     PUT /api/v1/auth/updateuserdetails
// @access    Private
exports.updateUserDetails = async (req, res, next) => {
  try {
    const poljaToUpdate = {
      name :req.body.name,
      email: req.body.email
    }
    console.log('updateDetails'.green, req.user.id);

    const user = await User.findByIdAndUpdate(req.user.id, poljaToUpdate, {
      new:true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(new ErrorResponse(error, 400));
  }
};

/////////////////////////////////////////////////////////
// @desc      UPDATE password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = async (req, res, next) => {
  try { 
    // za logiranog usera trazimo u bazi, selektiramo
    const user = await User.findById(req.user.id).select('+password');

  //  Provjeri dali je password u bazi jednak unesenom, ako ne baci grešku
    if(!(await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse('Password je neispravan', 400));
    }

    user.password = req.body.newPassword;
    // snimanje podataka
    await user.save()
    
    //šaljemo NOVI TOKEN token
    sendTokenResponse(user, 200, res);
  } catch (error) {
    return next(new ErrorResponse(error, 400));
  }
};


////////////////////////////////////////////////////////////
// @desc      Zaboravio sam password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotpassword = async (req, res, next) => {
  try {
    // Trazimo usera prema email-u
    const user = await User.findOne({ email: req.body.email });

    // ako nema ragistriranog korisnika pod tim emailom, javlja grešku
    if (!user) {
      return next(new ErrorResponse('Takav korisni ne postoji!', 400));
    }

    // Resetiraj TOKEN za ovog korisnika
    const resetToken = user.getResetPasswordToken();

    // snimi privremeno resetPasswordToken i resetPasswordExpire u bazu
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    //Poruka za usera
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message: message,
      });
      res.status(200).json({
        success: true,
        data: 'Email sent',
        email: req.body.email,
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // snimi promjene
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
};

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

      if (!user) {
        return next(new ErrorResponse('Invalid token', 400));
      }

      // Set new password
      user.password = req.body.password;
      // ove vrijednosti nam vise ne trabaju u bazi, brisemo ih
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      sendTokenResponse(user, 200, res);
  } catch (error) {
    console.log(error);
  }
};

////////////////////////////////////////////////////////////////
//TOKEN
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  // const token = user.getSignedJwtToken();  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
  
  const options = {
    expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    console.log('production'.green);
    options.secure = true;
  }

  // saljemo TOKEN u browser.....
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token: token,
  });
};
