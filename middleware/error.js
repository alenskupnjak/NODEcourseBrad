const errorHandlerSvi = (err, req, res, next) => {
  console.log(err.stack.red);
  res.status(err.statusCode || 500).json({
    sucess: 'neuspjelo',
    error: err.message || 'Server error'
  });
};

module.exports = errorHandlerSvi;
