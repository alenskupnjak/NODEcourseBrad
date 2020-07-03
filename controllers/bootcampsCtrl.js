const Bootcamp = require('../models/Bootcamps');
const asyncHandler = require('../middleware/async')
const { ispisi } = require('../config/ispisi');
const ErrorResponse = require('../utils/errorResponse');

// const fs = require('fs');

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // try {
    ispisi('03- Očitavanje svih zapisa, bootcampsCtrl.js', 1);

    const bootCamps = await Bootcamp.find();

    res.status(200).json({
      sucess: true,
      duljinaZapisa: bootCamps.length,
      data: bootCamps,
    });
  // } catch (error) {
  //   next(error);
  //   // res.status(400).json({
  //   //   sucess: false,
  //   //   poruka: 'Očitavanje zapisa iz baze nije uspjela',
  //   // });
  // }
});

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = asyncHandler( async (req, res, next) => {
  // try {
    ispisi('04- Očitavanje jednog zapisa, bootcampsCtrl.js', 1);

    const bootCamps = await Bootcamp.findById(req.params.id);

    if (!bootCamps) {
      return next(
        new ErrorResponse(`Bootcamp not found id of ${req.params.id}`, 404)
      );
    }
    console.log('tutu');

    res.status(200).json({
      sucess: true,
      msg: `Prikaži ${req.params.id}`,
      data: bootCamps,
    });
  // } catch (error) {
  //   ispisi('04- Očitavanje jednog zapisa, bootcampsCtrl.js', 0);
  //   // next(new ErrorResponse(`Bootcamp not found id of ${req.params.id}`, 404));
  //   next(error);
  //   // res.status(400).json({
  //   //   sucess: false,
  //   //   poruka: 'Očitavanje zapisa iz baze nije uspjelaccc',
  //   // });
  // }
});

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
    next(error);
    // res.status(400).json({
    //   sucess: false,
    //   poruka: 'Greška kod zapisa',
    // });
  }
};

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootCamps = await Bootcamp.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!bootCamps) {
      return new ErrorResponse('Nije naso zapis u bazi', 404)
      // return res
      //   .status(400)
      //   .json({ sucess: false, poruka: 'Nije naso zapis!' });
    }
    res.status(200).json({
      sucess: true,
      msg: `Prikaži ${req.params.id}`,
      data: bootCamps,
    });
  } catch (error) {
    next(error);
    // res.status(400).json({
    //   sucess: false,
    //   poruka: error.message,
    // });
  }
};

// @desc      Delate bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    ispisi('06- DELETE jednog zapisa, bootcampsCtrl.js', 1);

    const deleteBoot = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!deleteBoot) {
      return new ErrorResponse('Nije naso zapis u bazi za brisati', 404)
      return res
        .status(400)
        .json({ sucess: false, poruka: 'Nije naso zapis za obrisati u bazi!' });
    }

    res.status(200).json({
      sucess: true,
      msg: `Prikaži ${req.params.id}`,
      poruka: 'Obrisan bootcamp',
    });
  } catch (error) {
    next(error);
    // res.status(400).json({
    //   sucess: false,
    //   poruka: 'DELETE jednog zapisa iz baze nije uspjela',
    // });
  }
};
