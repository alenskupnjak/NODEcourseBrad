const express = require('express');
const router = express.Router();
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
  getBootcampsData
} = require('../controllers/bootcampCtrl');

// štiti rute od neulogiranih usera
// const { protect, authorize, authorizeKorisnik } = require('../middleware/auth');
const { protect, authorizeKorisnik } = require('../middleware/auth');

const Bootcamp = require('../models/BootcampsMod');
const advancedResults = require('../middleware/advancedResults');

// Include other resource routers, za Re-rute
const courseRouter = require('./coursesRouter');
const reviewRouter = require('./reviewsRouter');

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter );


// dohvati Geocode u sfernim koordinatama
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/:id/photo')
  .put(protect, authorizeKorisnik('publisher', 'admin'), bootcampPhotoUpload);

// dohvati sve
router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorizeKorisnik('publisher', 'admin'), createBootcamp);


// dohvati sve podatke
router
  .route('/data')
  .get(advancedResults(Bootcamp, 'courses'), getBootcampsData)

// dohvati jednog
router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorizeKorisnik('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorizeKorisnik('publisher', 'admin'), deleteBootcamp);

module.exports = router;
