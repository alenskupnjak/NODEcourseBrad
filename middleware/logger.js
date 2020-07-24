var colors = require('colors');

const logger = (req, res, next) => {
  console.log(colors.yellow(req.body));
  
  req.hello = 'Pozdrav svijetu';
  req.postman = req.body
  res.postman = req.body
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
  console.log(req.get('connection'));
  console.log(req.get('cookie'));
  console.log(colors.yellow.inverse(req.body));
  next();
};

module.exports = logger;
