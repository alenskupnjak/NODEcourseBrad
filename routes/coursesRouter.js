const express = require('express');

const {
  getCourses,
  getCourseOne,
  addCourseOne,
  updateCourseOne,
  deleteCourseOne,
} = require('../controllers/coursesCtrl');

const Course = require('../models/CourseMod');

const router = express.Router({ mergeParams: true });

// const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getCourses)
  // .post(protect, authorize('publisher', 'admin'), addCourse);
  .post(addCourseOne);

router
  .route('/:id')
  .get(getCourseOne)
  .put(updateCourseOne)
  .delete(deleteCourseOne);
  //   .put(protect, authorize('publisher', 'admin'), updateCourse)
//   .delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;
