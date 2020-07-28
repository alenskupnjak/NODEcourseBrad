const express = require('express');
const router = express.Router();
const bootCampCtrl = require('../controllers/bootcampCtrl');

// štiti rute od neulogiranih usera
// const { protect, authorize, authorizeKorisnik } = require('../middleware/auth');
const { protect, authorizeKorisnik } = require('../middleware/auth');

const Bootcamp = require('../models/BootcampsMod');
const advancedResults = require('../middleware/advancedResults');

// Include other resource routers, za Re-rute
const courseRouter = require('./coursesRouter');
const reviewRouter = require('./reviewsRouter');

// PATH /api/v1/bootcamps
// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

// dohvati Geocode u sfernim koordinatama
router
  .route('/radius/:zipcode/:distance')
  .get(protect,bootCampCtrl.getBootcampsInRadius);
  
router.route('/radius').post(protect, bootCampCtrl.getBootcampsInRadius);

// dohvati slike
router
  .route('/:id/photo')
  .put(
    protect,
    authorizeKorisnik('publisher', 'admin'),
    bootCampCtrl.bootcampPhotoUpload
  );

// dohvati sve
router
  .route('/')
  .get(protect, advancedResults(Bootcamp, 'courses'), bootCampCtrl.getBootcamps)
  .post(
    protect,
    authorizeKorisnik('publisher', 'admin'),
    bootCampCtrl.createBootcamp
  );

// dohvati jednog
router
  .route('/:id')
  .get(protect, bootCampCtrl.getBootcamp)
  .put(
    protect,
    authorizeKorisnik('publisher', 'admin'),
    bootCampCtrl.updateBootcamp
  )
  .delete(
    protect,
    authorizeKorisnik('publisher', 'admin'),
    bootCampCtrl.deleteBootcamp
  );

module.exports = router;
