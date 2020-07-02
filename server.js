const express = require('express');
const dotenv = require('dotenv'); // Load config file

// definiramo path za file u koji spremamo potrebne varijable
dotenv.config({ path: './config/config.env' });

//inicijalizacija aplikacije
const app = express();

// definiranje porta
const PORT = process.env.PORT || 5000;

// dohvati sve
app.get('/api/v1/bootcamps', (req, res) => {
  res.status(400).json({
    sucess: true,
    msg: 'Prikaži sve bootcamps',
  });
});

// dohvati jednog
app.get('/api/v1/bootcamps/:id', (req, res) => {
  res.status(400).json({
    sucess: true,
    msg: `Prikaži ${req.params.id}`,
  });
});

app.post('/api/v1/bootcamps', (req, res) => {
  res.status(200).json({
    sucess: true,
    msg: 'Kreiraj bootcamps',
  });
});

// UPDATE
app.put('/api/v1/bootcamps/:id', (req, res) => {
  res.status(200).json({
    sucess: true,
    msg: `Prikaži ${req.params.id}`,
  });
});

// DELETE
app.delete('/api/v1/bootcamps/:id', (req, res) => {
  res.status(200).json({
    sucess: true,
    msg: `Obriši ${req.params.id}`,
  });
});

// prati zahtijeve koji stizu
app.listen(PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
