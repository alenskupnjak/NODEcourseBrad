const ErrorResponse = require('../utils/errorResponse');
const { ispisi } = require('../config/ispisi');


const errorHandlerSvi = (err, req, res, next) => {
  console.log('U errorHandlerSvi sam');
  console.log(err);
  console.log('err.name=',err.name,'err.code', err.code);

  let errorPrekoKlase = { ...err };

  // Mongose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}!!`;
    errorPrekoKlase = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate key value entered`;
    errorPrekoKlase = new ErrorResponse(message, 400);
  }

  // Mongose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((data) => {
      return data.message;
    });
    errorPrekoKlase = new ErrorResponse(message, 400);
  }

  res.status(errorPrekoKlase.statusCode || 500).json({
    sucess: false,
    error: errorPrekoKlase.message || 'Server error',
    statuscode: errorPrekoKlase.statusCode,
    poruka: '  U errorHandlerSvi.js sam',
  });
};

module.exports = errorHandlerSvi;
