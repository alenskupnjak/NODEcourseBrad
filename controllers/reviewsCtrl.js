const colors = require('colors');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/ReviewMod');
const Bootcamp = require('../models/BootcampsMod');

// @desc      Get reviews
// @route     GET /api/v1/reviews
// @route     GET /api/v1/bootcamps/:bootcampId/reviews
// @access    Public
exports.getReviews = async (req, res, next) => {
  try {
    if (req.params.bootcampId) {
      const reviews = await Review.find({
        bootcamp: req.params.bootcampId,
      }).populate({
        path: 'bootcamp user',
        select: 'name description email',
      });


          // res.status(200).json({
          //   success: true,
          //   user: 'ne',
          //   count: reviews.length,
          //   reviews: reviews,
          // });

      res.status(200).render('reviews', {
        success: true,
        user: 'ne',
        count: reviews.length,
        reviews: reviews,
        userMenu: req.korisnik
      });

    } else {
      // console.log(colors.green(res.advancedResults));
      // res.status(200).json(res.advancedResults.data);

      res.status(200).render('manage-reviews', {
        success: true,
        user: 'ne',
        reviews: res.advancedResults.data,
        port: `${req.protocol}://${req.get('host')}`,
        userMenu: req.korisnik
      });
    }
  } catch (error) {
    next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
    );
  }
};

///////////////////////////////////////////////////////
// @desc      Get single review
// @route     GET /api/v1/reviews/:id
// @access    Public
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate({
      path: 'bootcamp user',
      select: 'name description',
    });

    if (!review) {
      console.log('Ovdje nikada ne mogu doci......'.red);
      return next(
        new ErrorResponse(
          `No review found with the id of ${req.params.id}`,
          404
        )
      );
    }
    console.log(review);
    
    res.status(201).render('review-edit',{
      success: true,
      review: review,
      userMenu: req.korisnik
    });
  } catch (error) {
    console.log('review= '.red, error);

    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
    );
  }
};

// @desc      Add review
// @route     POST /api/v1/bootcamps/:bootcampId/reviews
// @access    Private
exports.addReview = async (req, res, next) => {
  try {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    console.log(req.body.bootcamp);
    console.log(res.advancedResults);
    
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `No bootcamp with the id of ${req.params.bootcampId}`,
          404
        )
      );
    }

    const review = await Review.create(req.body);

    
    res.status(201).render('index',{
      success: true,
      bootcamps: res.advancedResults,
      userMenu: req.korisnik
    });
  } catch (error) {
    console.log(error);
    next(new ErrorResponse(error, 404));
  }
};

// @desc      Update review
// @route     PUT /api/v1/reviews/:id
// @access    Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  console.log(colors.red.inverse('-------------ajmooooo  vvv-------------'));
  console.log(req.body);

  

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
    userMenu: req.korisnik
  });
});

// @desc      Delete review
// @route     DELETE /api/v1/reviews/:id
// @access    Private
exports.deleteReview = async (req, res, next) => {
  // let review;
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(
        new ErrorResponse(`Nema review sa tim id ${req.params.id}`, 404)
      );
    }

    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`Not authorized to delete review`, 401));
    }

    await review.remove();

    res.status(200).json({
      success: true,
      poruka: 'Review obrisan!',
      userMenu: req.korisnik
    });
  } catch (error) {
    next(new ErrorResponse(error, 404));
  }
};
