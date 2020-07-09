const express = require('express');

const {
  getCourses,
  getCourseOne,
  addCourseOne,
  updateCourseOne,
  deleteCourseOne,
} = require('../controllers/coursesCtrl');

// štiti rute od neulogiranih usera
const { protect } = require('../middleware/auth');

const Course = require('../models/CourseMod');
const advancedResults = require('../middleware/advancedResults');


const router = express.Router({ mergeParams: true });

// const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description email',
    }),
    getCourses
  )
  // .post(protect, authorize('publisher', 'admin'), addCourse);
  .post(protect,addCourseOne);

router
  .route('/:id')
  .get(getCourseOne)
  .put(protect,updateCourseOne)
  .delete(protect,deleteCourseOne);
//   .put(protect, authorize('publisher', 'admin'), updateCourse)
//   .delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;
