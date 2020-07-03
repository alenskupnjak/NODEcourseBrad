const Bootcamp = require('../models/Bootcamps');
const { ispisi } = require('../config/ispisi');
// const fs = require('fs');

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = async (req, res, next) => {
  try {
    ispisi('03- Očitavanje svih zapisa, bootcampsCtrl.js', 1);

    const bootCamps = await Bootcamp.find();

    res.status(200).json({
      sucess: true,
      duljinaZapisa: bootCamps.length,
      msg: 'Prikaži sve bootcamps',
      data: bootCamps,
    });
  } catch (error) {
    res.status(400).json({
      sucess: false,
      poruka: 'Očitavanje zapisa iz baze nije uspjela',
    });
    ispisi('03- Očitavanje svih zapisa, bootcampsCtrl.js', 0);
  }
  next();
};

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = async (req, res, next) => {
  try {
    ispisi('04- Očitavanje jednog zapisa, bootcampsCtrl.js', 1);

    const bootCamps = await Bootcamp.findById(req.params.id);

    if (!bootCamps) {
      return res
        .status(400)
        .json({ sucess: false, poruka: 'Nije naso zapis!' });
    }
    console.log('tutu');

    res.status(200).json({
      sucess: true,
      msg: `Prikaži ${req.params.id}`,
      data: bootCamps,
    });
  } catch (error) {
    ispisi('04- Očitavanje jednog zapisa, bootcampsCtrl.js', 0);
    next(error);
    // res.status(400).json({
    //   sucess: false,
    //   poruka: 'Očitavanje zapisa iz baze nije uspjelaccc',
    // });
  }
};

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
exports.createBootcamp = async (req, res, next) => {
  try {
    ispisi('02- Kreiranje zapisa, bootcampsCtrl.js', 1);

    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      sucess: true,
      msg: 'Kreiraj bootcamps',
    });
  } catch (error) {
    res.status(400).json({
      sucess: false,
      poruka: 'Greška kod zapisa',
    });
    console.log(error, '02- Kreiranje zapisa campa nije uspjela'.bgRed);
  }
  next();
};

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    ispisi('05- UPDATE jednog zapisa, bootcampsCtrl.js', 1);

    const bootCamps = await Bootcamp.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!bootCamps) {
      return res
        .status(400)
        .json({ sucess: false, poruka: 'Nije naso zapis!' });
    }
    res.status(200).json({
      sucess: true,
      msg: `Prikaži ${req.params.id}`,
      data: bootCamps,
    });
  } catch (error) {
    ispisi(`05- UPDATE jednog zapisa, bootcampsCtrl.js` + error, 0);
    res.status(400).json({
      sucess: false,
      poruka: error.message,
    });
  }
  next();
};

// @desc      Delate bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    ispisi('06- DELETE jednog zapisa, bootcampsCtrl.js', 1);

    const deleteBoot = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!deleteBoot) {
      return res
        .status(400)
        .json({ sucess: false, poruka: 'Nije naso zapis!' });
    }

    res.status(200).json({
      sucess: true,
      msg: `Prikaži ${req.params.id}`,
      poruka: 'Obrisan bootcamp',
    });
  } catch (error) {
    ispisi('06- DELETE jednog zapisa, bootcampsCtrl.js', 0);
    res.status(400).json({
      sucess: false,
      poruka: 'DELETE jednog zapisa iz baze nije uspjela',
    });
  }
  next();
};
