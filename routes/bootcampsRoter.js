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
} = require('../controllers/bootcampCtrl');

const Bootcamp = require('../models/BootcampsMod');
const advancedResults = require('../middleware/advancedResults');

// Include other resource routers, za Re-rute
const courseRouter = require('./coursesRouter');
// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

// dohvati Geocode u sfernim koordinatama
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/:id/photo')
  // .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);
  .put(bootcampPhotoUpload);

// dohvati sve
router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamp);

// dohvati jednog
router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
