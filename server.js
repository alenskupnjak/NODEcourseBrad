const express = require('express');
const dotenv = require('dotenv'); // Load config file

// definiramo path za file u koji spremamo potrebne varijable
dotenv.config({ path: './config/config.env' });

//Route files
const bootcampRouter = require('./routes/bootcampsRouter');

//inicijalizacija aplikacije
const app = express();

//Mount routers

// definiranje porta
const PORT = process.env.PORT || 5000;
app.use('/api/v1/bootcamps', bootcampRouter);

// prati zahtijeve koji stizu
app.listen(PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
