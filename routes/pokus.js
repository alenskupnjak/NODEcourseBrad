const express = require('express');

const {getBootcampsPokus} = require('../controllers/pokus');

const Course = require('../models/Course');

const router = express.Router({ mergeParams: true });


// const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

router
.route('/')
.get(getBootcampsPokus);
  // .post(protect, authorize('publisher', 'admin'), addCourse);

// router
//   .route('/:id')
//   .get(getCourse)
//   .put(protect, authorize('publisher', 'admin'), updateCourse)
//   .delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;
