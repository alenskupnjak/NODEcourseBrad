const Bootcamp = require('../models/BootcampsMod');
const asyncHandler = require('../middleware/async');
const path = require('path');
const geocoder = require('../utils/geocoder');
const ErrorResponse = require('../utils/errorResponse');
const colors = require('colors');

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // res.status(200).json(res.advancedResults);
  const podaci = res.advancedResults.data;

  res.render('bootcamps', {
    pageTitle: 'Get Botcamps',
    bootcamps: res.advancedResults.data,
    userMenu: req.korisnik,
  });
});

//
// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  // try {
  const bootCamp = await Bootcamp.findById(req.params.id).populate({
    path: 'courses',
    select: 'title weeks minimumSkill',
  });

  if (!bootCamp) {
    return next(
      new ErrorResponse(`Bootcamp not found id of ${req.params.id}`, 404)
    );
  }

  var result = Object.keys(bootCamp).map((key) => [String(key), bootCamp[key]]);

  // res.status(200).json({
  //   sucess: true,
  //   msg: `Prikaži ${req.params.id}`,
  //   data: bootCamp,
  // });
  res.status(200).render('bootcamp', {
    sucess: true,
    msg: `Prikaži ${req.params.id}`,
    bootCamp: bootCamp,
    boot: JSON.stringify(bootCamp),
    userMenu: req.korisnik,
  });
});

//////////////////////////////////////////////////////
// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
exports.createBootcamp = async (req, res, next) => {
  try {
    // Add user to req,body
    req.body.user = req.user.id;

    // Check for published bootcamp, user može upisati samo jedan bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

    // If the user is not an admin, they can only add one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `The user with ID ${req.user.id} has already published a bootcamp`,
          400
        )
      );
    }

    const bootcamp = await Bootcamp.create(req.body);
    console.log(bootcamp);

    res.status(201).json({
      sucess: true,
      msg: 'Kreiraj bootcamps',
      bootcamp: bootcamp,
    });
  } catch (error) {
    next(new ErrorResponse(`Problem sa kreiranjem bootcampa ${error}`, 404));
  }
};

////////////////////////////////////////////////////////////////////////
// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    let bootCamps = await Bootcamp.findById(req.params.id);

    if (!bootCamps) {
      return new ErrorResponse('Nije naso zapis u bazi', 404);
    }

    // Provjeri da li je user bootcamp owner
    if (
      bootCamps.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.params.id} is not authorized to update this bootcamp`,
          401
        )
      );
    }

    bootCamps = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      sucess: true,
      msg: `Prikaži ${req.params.id}`,
      data: bootCamps,
    });
  } catch (error) {
    next(
      new ErrorResponse(
        `Korisnik ${req.user.id} nije autoriziran za update ovog bootcama ${req.params.id}`,
        401
      )
    );
  }
};

//////////////////////////////////////////////////////////////////////////////
// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    // const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    const bootcamp = await Bootcamp.findById(req.params.id);
    console.log('bootcamp'.red, bootcamp);

    // nije našao zapis u bazi, javlja grešku
    if (!bootcamp) {
      console.log(' ovdije nikad nece doci.......');
      return next(
        new ErrorResponse('Nije naso zapis u bazi, ne moze obrisati', 404)
      );
    }

    // Provjeri da li je user bootcamp owner
    if (bootcamp.user.toString() === req.user.id || req.user.role === 'admin') {
      // ovo radimo da možemo aktivirati(MIDDLEWERE-01remove)
      bootcamp.remove();

      // imamo admina ili owner-a , saljemo sucess
      res.status(200).json({
        sucess: true,
        msg: `Prikaži ${req.params.id}`,
        poruka: 'Obrisan bootcamp',
      });
    } else {
      return next(
        new ErrorResponse(
          `Korisnik ${req.user.id} nije autoriziran za brisanje ovog bootcama ${req.params.id}`,
          401
        )
      );
    }
  } catch (error) {
    return next(new ErrorResponse('Nije naso zapis u bazi za brisati!!!', 404));
  }
};

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @route     POST /api/v1/bootcamps/radius
// @access    Private
exports.getBootcampsInRadius = async (req, res, next) => {
  try {
    console.log('-----------xxxxxxx--------');
    let zipcode;
    let miles;
    console.log(req.params, req.body);
    console.log(req.params.zipcode, req.body.zipcode);
    if (req.params.zipcode) {
      zipcode = req.params.zipcode;
      miles = req.params.miles;
    }

    if (req.body.zipcode) {
      zipcode = req.body.zipcode;
      miles = req.body.miles;
    }

    console.log(zipcode, miles);

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
    const radius = miles / 3963;

    const bootcamps = await Bootcamp.find({
      //https://docs.mongodb.com/manual/reference/operator/query/centerSphere/#op._S_centerSphere
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    const doma = await Bootcamp.find({
      //https://docs.mongodb.com/manual/reference/operator/query/centerSphere/#op._S_centerSphere
      location: { $geoWithin: { $centerSphere: [[lngDoma, latDoma], radius] } },
    });

    res.status(200).render('bootcamps', {
      success: true,
      count: bootcamps.length,
      doma: doma,
      pageTitle: 'Get Botcamps',
      bootcamps: bootcamps,
      userMenu: req.korisnik,
    });
  } catch (error) {
    next(new ErrorResponse(`Geografija ${error}`, 400));
  }
};

// @desc      UPLOAD photo
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
exports.bootcampPhotoUpload = async (req, res, next) => {
  try {
    // Tražimo id u bazi za sliku
    const fotoBoot = await Bootcamp.findById(req.params.id);

    console.log(fotoBoot);

    if (!fotoBoot) {
      return new ErrorResponse('Nije naso zapis u bazi za brisati', 404);
      return res
        .status(400)
        .json({ sucess: false, poruka: 'Nije naso zapis za obrisati u bazi!' });
    }

    // // Provjeri da li je user bootcamp owner
    if (fotoBoot.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this bootcamp`,
          401
        )
      );
    }

    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

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
        slika: 'Slika usnimljena',
        data: file.name,
      });
    });
  } catch (error) {
    return next(new ErrorResponse('Greška u photo!!!', 404));
  }
};
