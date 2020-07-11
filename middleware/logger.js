var colors = require('colors');

const logger = (req, res, next) => {
  req.hello = 'Pozdrav svijetu';
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
  console.log(req.get('connection'));
  console.log(req.get('cookie'));
  console.log(colors.yellow(req.body));
  next();
};

module.exports = logger;
