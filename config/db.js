const mongoose = require('mongoose');
const { ispisi } = require('../config/ispisi');

// spajanje na databazu
const connectDB = () => {
  mongoose
    .connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      ispisi('00- Spajanje na bazu, db.js', 1);
      console.log(`${process.env.OS}, Spojen na MongoDB, PORT= ${process.env.PORT}`.yellow.bold);
      if (process.env.NODE_ENV === 'production') {
        console.log(`Radim u ${process.env.NODE_ENV} modu`.underline.blue);
      } else {
        console.log(`Radim u ${process.env.NODE_ENV}-modu`.underline.blue);
      }
    })
    .catch((err) => {
      ispisi('00- Spajanje na bazu nije uspjelo, db.js', 0);
    });
};

module.exports = connectDB;
