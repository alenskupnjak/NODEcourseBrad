const express = require('express');
const dotenv = require('dotenv'); // Load config file

// definiramo path za file u koji spremamo potrebne varijable
dotenv.config({ path: './config/config.env' });

//inicijalizacija aplikacije
const app = express();

// definiranje porta
const PORT = process.env.PORT || 5000


app.listen(PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
