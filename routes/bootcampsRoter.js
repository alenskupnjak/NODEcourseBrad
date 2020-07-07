const express = require('express');
const router = express.Router();
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
} = require('../controllers/bootcampCtrl');


// Include other resource routers, za Re-rute
const courseRouter = require('./coursesRouter');
// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);



// dohvati Geocode u sfernim koordinatama
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

// dohvati sve
router
  .route('/')
  .get(getBootcamps)
  .post(createBootcamp);

// dohvati jednog
router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
