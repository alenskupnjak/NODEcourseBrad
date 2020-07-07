const colors = require('colors');
const { ispisi } = require('./config/ispisi');
const errorHandlerSvi = require('./middleware/error');
const express = require('express');
const dotenv = require('dotenv'); // Load config file
const logger = require('./middleware/logger');
const morgan = require('morgan');
const connectDB = require('./config/db');

ispisi('------ START --------', 1);

// definiramo path za file u koji spremamo potrebne varijable
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const bootcampRouter = require('./routes/bootcampsRoter');
const coursesRouter = require('./routes/coursesRouter');

//inicijalizacija aplikacije
const app = express();

// Body parser, bez ovoga ne mozemo slati podatke u req.body !!!!!
app.use(express.json());

// MIDDLEWARE
app.use(logger);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Mount routers
app.use('/api/v1/bootcamps', bootcampRouter);
app.use('/api/v1/courses', coursesRouter);

// MIDDLEWARE za greske
app.use(errorHandlerSvi);

// definiranje porta
const PORT = process.env.PORT || 5000;

// prati zahtijeve koji stizu
const server = app.listen(PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`.blue);
  console.log(process.env.NODE_ENV.yellow);
});

// zatvar program
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.bgRed);
  // Close server an exit process
  server.close(() => {
    process.exit(1);
  });
});
