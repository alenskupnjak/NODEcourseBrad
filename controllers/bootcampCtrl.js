const Bootcamp = require('../models/BootcampsMod');
const asyncHandler = require('../middleware/async');
const path = require('path');
const { ispisi } = require('../config/ispisi');
const geocoder = require('../utils/geocoder');
const ErrorResponse = require('../utils/errorResponse');

// const fs = require('fs');

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // try {
  ispisi('03- Očitavanje svih zapisa, bootcampsCtrl.js', 1);
  let query;

  // Copy req.query
  reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over remove fields and delete from reqQery
  removeFields.forEach((data) => {
    delete reqQuery[data];
  });
  console.log(reqQuery);

  // Create query strung
  let queryStr = JSON.stringify(reqQuery);

  // create operators ($gt, &gte, &gtl...)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = Bootcamp.find(JSON.parse(queryStr)).populate({
    path: 'coursesNekoIme',
    select: 'title weeks',
  });

  // Select fields SELECT
  if (req.query.select) {
    let polja = req.query.select.split(',').join(' ');
    query = query.select(polja);
  }

  // Select fields SORT
  if (req.query.sort) {
    let sort = req.query.sort.split(',').join(' ');
    query = query.sort(sort);
  } else {
    query = query.sort('createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalPage = await Bootcamp.countDocuments();

  query.skip(startIndex).limit(limit);

  // Executing query
  const bootCamps = await query;

  // Pagination results
  const pagination = {};

  if (endIndex < totalPage) {
    pagination.nextPage = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    pagination.prevPage = {
      page: page - 1,
      limit: limit,
    };
  }

  res.status(200).json({
    sucess: true,
    duljinaZapisa: bootCamps.length,
    pagination: pagination,
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
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  // try {
  ispisi('04- Očitavanje jednog zapisa, bootcampsCtrl.js', 1);

  const bootCamps = await Bootcamp.findById(req.params.id).populate({
    path: 'coursesNekoIme',
    select: 'title weeks minimumSkill',
  });

  if (!bootCamps) {
    return next(
      new ErrorResponse(`Bootcamp not found id of ${req.params.id}`, 404)
    );
  }

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
      return new ErrorResponse('Nije naso zapis u bazi', 404);
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

    // const deleteBoot = await Bootcamp.findByIdAndDelete(req.params.id);
    const deleteBoot = await Bootcamp.findById(req.params.id);

    if (!deleteBoot) {
      return next(new ErrorResponse('Nije naso zapis u bazi za brisati', 404));
      return res
        .status(400)
        .json({ sucess: false, poruka: 'Nije naso zapis za obrisati u bazi!' });
    }

    // ovo radimo da možemo aktivirati(MIDDLEWERE-01remove)
    deleteBoot.remove();

    res.status(200).json({
      sucess: true,
      msg: `Prikaži ${req.params.id}`,
      poruka: 'Obrisan bootcamp',
    });
  } catch (error) {
    // next(error);
    return next(new ErrorResponse('Nije naso zapis u bazi za brisati!!!', 404));

    // res.status(400).json({
    //   sucess: false,
    //   poruka: 'DELETE jednog zapisa iz baze nije uspjela',
    // });
  }
};



// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // za primjez
  const domaAdresa = await geocoder.geocode({
    address: '50C Kašinska cesta',
    countryCode: 'hr',
    zipcode: '10360',
  });
  const latDoma = domaAdresa[0].latitude;
  const lngDoma = domaAdresa[0].longitude;

  console.log(domaAdresa[0]);

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  console.log(loc);

  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  //1Km is equivalent to 0.6214 miles.
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    //https://docs.mongodb.com/manual/reference/operator/query/centerSphere/#op._S_centerSphere
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  const doma = await Bootcamp.find({
    //https://docs.mongodb.com/manual/reference/operator/query/centerSphere/#op._S_centerSphere
    location: { $geoWithin: { $centerSphere: [[lngDoma, latDoma], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
    doma: doma,
  });
});



// @desc      UPLOAD photo
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
exports.bootcampPhotoUpload = async (req, res, next) => {
  try {
    // Tražimo id u bazi za sliku
    const fotoBoot = await Bootcamp.findById(req.params.id);

    if (!fotoBoot) {
      return new ErrorResponse('Nije naso zapis u bazi za brisati', 404);
      return res
        .status(400)
        .json({ sucess: false, poruka: 'Nije naso zapis za obrisati u bazi!' });
    }

    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;
    console.log(file);

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse('Please upload an image file!', 400));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }

    // Create custom filename
    file.name = `photo_${fotoBoot._id}${path.parse(file.name).ext}`;
    console.log(file.name);

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }

      await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

      res.status(200).json({
        success: true,
        slika:'Slika usnimljena',
        data: file.name,
      });
    });
  } catch (error) {
    return next(new ErrorResponse('Greška u photo!!!', 404));
  }
};
