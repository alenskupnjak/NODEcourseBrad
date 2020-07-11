const express = require('express');
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewsCtrl');

const Review = require('../models/ReviewMod');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorizeKorisnik } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getReviews
  )
  .post(protect, authorizeKorisnik('user', 'admin'), addReview);

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorizeKorisnik('user', 'admin'), updateReview)
  .delete(protect, authorizeKorisnik('user', 'admin'), deleteReview);

module.exports = router;
