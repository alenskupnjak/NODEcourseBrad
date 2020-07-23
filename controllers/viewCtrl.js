const Bootcamp = require('../models/BootcampsMod');
const asyncHandler = require('../middleware/async');

const ErrorResponse = require('../utils/errorResponse');

// @desc      Start page
// @route     GET /api/v1/view/index
// @access    Public
exports.getIndex = (req, res, next) => {
  try {
    console.log('viewCtrl, bootcampCtrl.js'.magenta, req.user, res.proba);
    //  res.status(200).json(res.advancedResults);
     
    res.status(200).render('index', {
      pageTitle: 'Check out',
      // data: res.advancedResults
    });
  } catch (error) {
    return next( new ErrorResponse( `xxxxx ed to update this bootcamp`,401));  
  }  
};

// @desc      Get all bootcamps
// @route     GET /api/v1/view/login
// @access    Public
exports.login = (req, res, next) => {
  try {
    console.log('viewCtrl, bootcampCtrl.js'.magenta, req.user, res.proba);
    //  res.status(200).json(res.advancedResults);
     
    res.status(200).render('login', {
      pageTitle: 'Check out',
    });
  } catch (error) {
    return next( new ErrorResponse( `xxxxx ed to update this bootcamp`,401));  
  }  
};

// @desc      Register
// @route     GET /api/v1/view/register
// @access    Public
exports.register = (req, res, next) => {
  try {
    console.log('viewCtrl, bootcampCtrl.js'.magenta, req.user, res.proba);
    //  res.status(200).json(res.advancedResults);
     
    res.status(200).render('register', {
      pageTitle: 'Check out',
      data: res.advancedResults
    });
  } catch (error) {
    return next( new ErrorResponse( `Greška kod registriranja`,401));  
  }  
};


// @desc      Zaboravljena lozinka
// @route     GET /api/v1/view/forgotpassword
// @access    Public
exports.forgotpassword = (req, res, next) => {
  try {
    console.log('viewCtrl, forgotpassword'.magenta.inverse, req.user);
    //  res.status(200).json(res.advancedResults);
     
    res.status(200).render('reset-password', {
      pageTitle: 'Reset password',
      data: res.advancedResults
    });
  } catch (error) {
    return next( new ErrorResponse( `Greška kod registriranja`,401));  
  }  
};