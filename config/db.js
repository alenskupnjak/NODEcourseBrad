const mongoose = require('mongoose');

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
      console.log('00-Spajanje na bazu'.underline.green);
      console.log(`${process.env.OS}, Spojen na MongoDB, PORT= ${process.env.PORT}`.yellow.bold);
      if (process.env.NODE_ENV === 'production') {
        console.log(`Radim u ${process.env.NODE_ENV} modu`.underline.blue);
      } else {
        console.log(`Radim u ${process.env.NODE_ENV}-modu`.underline.blue);
      }
    })
    .catch((err) => {
      console.log('Greška kod spajanja na Bazu');
    });
};

module.exports = connectDB;
