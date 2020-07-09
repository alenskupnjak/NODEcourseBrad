const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/UserMod');
const colors = require('colors');

//
// Protect routes
exports.protect = async (req, res, next) => {
  let token;
  console.log('auth.js, protect'.magenta, req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header

    token = req.headers.authorization.split(' ')[1];

    // Set token from cookie
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  } 

  try {
    // Verify token, usporeduje sa dobivenim tokenom i sekret ključem, vraca id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded='.blue, decoded);

    // ovaj user se koristi dalje u programu
    req.user = await User.findById(decoded.id);
    res.proba = 'probni text';

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  console.log('roles**********'.yellow, roles);
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`,403)
      );
    }
    next();
  };
};
