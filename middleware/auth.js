const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/UserMod');
const colors = require('colors');


// Protect routes
exports.protect = async (req, res, next) => {
  let token;
  console.log('auth.js, protect'.magenta,req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    
    token = req.headers.authorization.split(' ')[1];
    console.log('token='.green,token);
    // Set token from cookie
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  } else {
    console.log('token postoji'.green);
  }

  try {
    // Verify token, usporeduje sa dobivenim tokenom i sekret ključem
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded='.blue,decoded);
    
    // ovaj user se koristi dalje u programu
    req.user = await User.findById(decoded.id);
    res.proba = 'probni text'

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};