const colors = require('colors');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');
const errorHandlerSvi = require('./middleware/error');
const express = require('express');
const dotenv = require('dotenv'); // Load config file
const logger = require('./middleware/logger');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
let hpp = require('hpp');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/db');

// definiramo path za file u koji spremamo potrebne varijable
dotenv.config({ path: './config/config.env' });

// Spajanje na bazu
connectDB();

// Route files
const bootcampRouter = require('./routes/bootcampsRoter');
const coursesRouter = require('./routes/coursesRouter');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const reviewsRouter = require('./routes/reviewsRouter');
const viewRouter = require('./routes/viewRouter');

//inicijalizacija aplikacije
const app = express();

// definiramo template engine koji cemo koristiti u aplikaciji (EJS ili PUG ili express-handlebars)
// app.set('view engine', 'pug'); // za pug
app.set('view engine', 'ejs'); // za ejs
// kreiramo stazu odakle cemo vuci template
app.set('views', path.join(__dirname, 'views'));

// Body parser, bez ovoga ne mozemo slati podatke u req.body !!!!!
app.use(express.json());

// body -parser, bez ovoga ne salje podatke automatski kroz req.body (npm i body-parser)
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

// Cookie parser, za slanje TOKENA
app.use(cookieParser());

// MIDDLEWARE, pokusni
// app.use(logger);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File upload
app.use(fileUpload());

// Sanitize data, zastita podataka
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

//  apply to all requests
// app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/view', viewRouter);
app.use('/api/v1/bootcamps', bootcampRouter);
app.use('/api/v1/courses', coursesRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewsRouter);

// MIDDLEWARE za greske
app.use(errorHandlerSvi);

// definiranje porta
const PORT = process.env.PORT || 5500;

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
