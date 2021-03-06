const crypto = require('crypto');
const User = require('../models/UserMod');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
// const bcryptjs = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');
const colors = require('colors');

/////////////////////////////////////////////////////////
// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, password2, role } = req.body;

    if (password !== password2) {
      return next(
        new ErrorResponse('Upisani passwordi se ne podudaraju.', 400)
      );
    }

    const userProvjera = await User.findOne({ email: email });

    if (userProvjera !== null) {
      return next(new ErrorResponse('Takav korisnik već postoji', 400));
    }
    //Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    //šaljemo token
    sendTokenResponse(user, 200, res, req);
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
    } 

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid password', 401));
    } 

    // svi uvijet zadovoljeni, logiramo se, šaljemo token
    user.postmanLogin = req.body.postmanLogin;

    sendTokenResponse(user, 200, res, req);
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
    console.log(req.user.id);
    const user = await User.findById(req.user.id).select('+password');
    console.log(user);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(new ErrorResponse(error, 400));
  }
};

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(new ErrorResponse(error, 400));
  }
};

///////////////////////////////////////////////
// @desc      UPDATE user details
// @route     PUT /api/v1/auth/updateuserdetails
// @access    Private
exports.updateUserDetails = async (req, res, next) => {
  try {
    console.log(req.user);

    const poljaToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };

    // pronalazimo korisnika i radimo update podataka
    await User.findByIdAndUpdate(req.user.id, poljaToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).render('manage-account', {
      pageTitle: 'Manage-account',
      data: res.advancedResults,
      user: req.user,
      userMenu: req.korisnik
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
    if (req.body.newPassword !== req.body.newPasswordConfirm) {
      return next(
        new ErrorResponse('Upisani novi passwordi se razlikuju', 400)
      );
    }
    // za logiranog usera trazimo u bazi, selektiramo
    const user = await User.findById(req.user.id).select('+password');

    //  Provjeri dali je password u bazi jednak unesenom, ako ne baci grešku
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse('Password je neispravan', 400));
    }

    user.password = req.body.newPassword;
    // snimanje podataka
    await user.save();

    //šaljemo NOVI TOKEN token
    sendTokenResponse(user, 200, res);

    // res.redirect('/');
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
      return next(
        new ErrorResponse(
          `Korisnik  ${req.body.email}\n ne postoji, molimo da se registrirate!`,
          400
        )
      );
    }

    // Resetiraj TOKEN za ovog korisnika
    // const resetToken = user.getResetPasswordToken();

    // Generira slučajni token koji cemo kriptirati
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire za 4 sata
    user.resetPasswordExpire = Date.now() + 240 * 60 * 1000;

    console.log(user);

    // snimi privremeno resetPasswordToken i resetPasswordExpire u bazu
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/resetpassword/${resetToken}`;

    //Poruka za usera
    const message = `Please make a PUT request to: \n\n ${resetUrl} \n <a href="${resetUrl}">Link</a>` ;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token za aplikaciju Kampovi',
        message: message,
      });

      res.status(200).render('send-mail-reset-password-alert', {
        success: true,
        pageTitle: 'Check email',
        data: 'Email sent',
        email: req.body.email,
        userMenu: req.korisnik
      });
    } catch (error) {
      return next(new ErrorResponse('Email could not be sent', 500));
    }
  } catch (error) {
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
    console.log('-----------------------');
    console.log(req.body);
    if (req.body.password !== req.body.passwordConfirm) {
      return next(new ErrorResponse('Passwordi se ne podudaraju', 400));
    }

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
    // user.resetPasswordToken = undefined;
    // user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(new ErrorResponse(error, 400));
  }
};

// @desc      Dobivamo LINK od usera za Reset password
// @route     GET /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.getResetPassword = async (req, res, next) => {
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
      return next(new ErrorResponse('Takav korisnik ne postoji', 400));
    }

    // user je detektiran
    console.log(colors.green.inverse(user._id));
    // const token = user.getSignedJwtToken();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

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

    res.status(222).cookie('token', token, options).render('reset-password', {
      success: true,
      pageTitle: 'Reset password',
      resettoken: req.params.resettoken,
      user: user,
      userMenu: req.korisnik
    });
  } catch (error) {
    next(new ErrorResponse('Invalid token xxxx', 400));
  }
};

////////////////////////////////////////////////////////////////
//TOKEN
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, req) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  console.log('Trenutni korisnik je ...', req.korisnik);

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

  // ako upit dolazi iz postmana Postman dobiva svoj token, a HTML svoj token
  if (user.postmanLogin) {
    res.status(statusCode).cookie('token', token, options).json({
      success: true,
      token: token,
      user: user,
      postmanLogin: user.postmanLogin,
    });
  } else {
    res.status(statusCode).cookie('tokenHTML', token, options).render('index', {
      success: true,
      token: token,
      user: user,
      postmanLogin: user.postmanLogin,
      userMenu: req.korisnik
    });
  }
};
