const { ispisi } = require('../config/ispisi');

const logger = (req, res, next) => {
  req.hello = 'Pozdrav svijetu';
  ispisi('01- logger.js  za primjer // MIDDLEWARE',1);

  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
  console.log(req.get('connection'));
  console.log(req.get('cookie'));

  next();
};

module.exports = logger;
