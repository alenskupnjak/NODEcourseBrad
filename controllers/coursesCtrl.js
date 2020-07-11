const Course = require('../models/CourseMod');
const Bootcamp = require('../models/BootcampsMod');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = async (req, res, next) => {
  try {
    // let query;

    if (req.params.bootcampId) {
      // ako trazimo pojedinacan course
      const courses = await Course.find({ bootcamp: req.params.bootcampId });

      return res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
      });
    } else {
      res.status(200).json(res.advancedResults);
    }

    // const courses = await query;

    // res.status(200).json({
    //   success: true,
    //   count: courses.length,
    //   data: courses,
    // });
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

// @desc      Get single course
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getCourseOne = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: 'bootcamp',
      select: 'name description',
    });

    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`),
        404
      );
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.log(error);
  }
};

// @desc      Add single course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.addCourseOne = async (req, res, next) => {
  try {
    // spremamo URL.Id
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    // Prvo tražimo u bootcamp i taj cemo spajati sa course
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `No bootcamp with the id of ${req.params.bootcampId}`
        ),
        404
      );
    }

    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
          401
        )
      );
    }

    const course = await Course.create(req.body);

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.log(error);
  }
};

// @desc      UPDATE single course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateCourseOne = async (req, res, next) => {
  try {
    // Prvo tražimo u bootcamp i taj cemo spajati sa course
    let course = await Course.findById(req.params.id);

    if (!course) {
      return next(
        new ErrorResponse(`Nema Course with the id of ${req.params.id}`),
        404
      );
    }

    // Make sure user is course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to UPDATE a course to bootcamp ${course._id}`,
          401
        )
      );
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    return next(
      new ErrorResponse(`Nema Course with the id of ${req.params.id}`),
      404
    );
  }
};

// @desc      DELETE single course
// @route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteCourseOne = async (req, res, next) => {
  try {
    // Prvo tražimo u bootcamp i taj cemo spajati sa course
    const course = await Course.findById(req.params.id);
    

    if (!course) {
      return next(
        new ErrorResponse(`Nema Course with the id of ${req.params.id}`),
        404
      );
    }

    // Make sure user is course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to DELETE a course to bootcamp ${course._id}, korisnik ${course.user} DA`,
          401
        )
      );
    }

    // brišemo jedan course
    await course.remove();

    res.status(200).json({
      success: true,
      data: course,
      poruka: 'Obrisan course'
    });
  } catch (error) {
    console.log('deleteCourseOne=***'.red, error);
    return next(
      new ErrorResponse(`Nema Course with the id of ${req.params.id}`),
      404
    );
  }
};
