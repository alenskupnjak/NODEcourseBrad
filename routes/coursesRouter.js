const express = require('express');

const {
  getCourses,
  getCourseOne,
  addCourseOne,
  updateCourseOne,
  deleteCourseOne,
} = require('../controllers/coursesCtrl');

// štiti rute od neulogiranih usera
const { protect, authorize } = require('../middleware/auth');

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
    getCourses
  )
  .post(protect, authorize('publisher', 'admin'), addCourseOne);

router
  .route('/:id')
  .get(getCourseOne)
  .put(protect, authorize('publisher', 'admin'), updateCourseOne)
  .delete(protect, authorize('publisher', 'admin'), deleteCourseOne);

module.exports = router;
