const errorHandlerSvi = (err, req, res, next) => {
  console.log(err.stack.red);
  res.status(500).json({
    sucess: false,
    error: err.message,
  });
};

module.exports = errorHandlerSvi;
