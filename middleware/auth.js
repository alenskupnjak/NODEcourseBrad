const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/UserMod');
const colors = require('colors');

//
// Protect routes
exports.protect = async (req, res, next) => {
  let token;
  console.log(colors.bgRed( req.headers.authorization ));

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.tokenHTML) {
    token = req.cookies.tokenHTML;
  }

  // Make sure token exists
  if (!token) {
    return next(
      new ErrorResponse('Nisi autoriziran authorized to access this route', 401)
    );
  }

  try {
    
    // Verify token, usporeduje sa dobivenim tokenom i sekret ključem, vraca id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    
    // ovaj user se koristi dalje u programu
    req.user = await User.findById(decoded.id);
    console.log('---------------------');
    
    console.log(req.user);
    next();
  } catch (err) {
    return next(
      new ErrorResponse('Not authorized to access this route !!!', 401)
    );
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log('roles**********'.yellow, roles);
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

// Grant access to specific roles
exports.authorizeKorisnik = (...roles) => {
  return (req, res, next) => {
    console.log('roles**********'.bgRed, roles, req.user.role);
    if (roles.includes(req.user.role)) {
      // User je ovlašten, nastavlja sa radom
      return next();
    }
    // Korisnik nije ovlašten za ovu stazi
    next(
      new ErrorResponse(
        `User role ${req.user.role} is not authorized to access this route`,
        403
      )
    );
  };
};
