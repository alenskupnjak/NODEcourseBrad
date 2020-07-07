const fs = require('fs');
const colors = require('colors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load model
const Bootcamp = require('./models/BootcampsMod');
const Course = require('./models/CourseMod');
// const User = require('./models/User');
const Review = require('./models/ReviewMod');

// spajanje na 0Baa5idK2ZQuELRwPznQ
const connectDB = () => {
  mongoose
    .connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(
        `${process.env.OS}, Spojen na MongoDB, PORT= ${process.env.PORT}`.yellow
          .bold
      );
      if (process.env.NODE_ENV === 'production') {
        console.log(`Radim u ${process.env.NODE_ENV} modu`.underline.blue);
      } else {
        console.log(`Radim u ${process.env.NODE_ENV}-modu`.underline.blue);
      }
    })
    .catch((err) => {
      console.log(err.red, 'Nisam se spoji na bazu'.red);
    });
};

// Connect to database
connectDB();

// Read JSON file
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);

// console.log(bootcamp, courses, reviews, users);

// Import u bazu
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    // await User.create(users);
    await Review.create(reviews);
    console.log('Updaci importirani u bazu'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data
const deleteData = async () => {
  try {
    // brise cijeli zapis u bazi
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    // await User.deleteMany();
    await Review.deleteMany();
    console.log('Updaci obrisani u bazi'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

console.log(process.argv);

if (process.argv[2] === '-i') {
  importData();
}

if (process.argv[2] === '-d') {
  deleteData();
}

// Brisanje podataka iz baze
// node izBaze.js -d

// Importiranje podataka iz baze
// node izBaze.js -i
