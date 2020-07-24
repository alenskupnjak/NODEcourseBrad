const express = require('express');

const courseController = require('../controllers/coursesCtrl');

// štiti rute od neulogiranih usera
const { protect, authorizeKorisnik } = require('../middleware/auth');

const Course = require('../models/CourseMod');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description email',
    }),
    courseController.getCourses
  )
  .post(
    protect,
    authorizeKorisnik('publisher', 'admin'),
    courseController.addCourseOne
  );

router
  .route('/:id')
  .get(courseController.getCourseOne)
  .put(
    protect,
    authorizeKorisnik('publisher', 'admin'),
    courseController.updateCourseOne
  )
  .delete(
    protect,
    authorizeKorisnik('publisher', 'admin'),
    courseController.deleteCourseOne
  );

module.exports = router;
