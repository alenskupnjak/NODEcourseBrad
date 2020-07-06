const Course = require('../models/Course');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = async (req, res, next) => {
  try {
    let query;

    if (req.params.bootcampId) {      
      // ako trazimo pojedinacan course
      query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
      // svi coursevi
      query = Course.find().populate({
        path: 'bootcamp',
        select: 'name description email'
      });
    }

    const courses = await query;

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.log(error);
  }

  // if (req.params.bootcampId) {
  //   const courses = await Course.find({ bootcamp: req.params.bootcampId });

  //   return res.status(200).json({
  //     success: true,
  //     count: courses.length,
  //     data: courses
  //   });
  // } else {
  //   res.status(200).json(res.advancedResults);
  // }
};
