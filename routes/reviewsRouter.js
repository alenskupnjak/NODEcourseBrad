const express = require('express');
const reviewsControll = require('../controllers/reviewsCtrl');
const Review = require('../models/ReviewMod');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorizeKorisnik } = require('../middleware/auth');

router
  .route('/')
  .get(advancedResults(Review, {path: 'bootcamp user',select: 'name description',}),reviewsControll.getReviews)
  // .get(advancedResults(Review, {path: 'bootcamp',select: 'name description',}),reviewsControll.getReviews)
  .post(protect, authorizeKorisnik('user', 'admin'), reviewsControll.addReview);

router
  .route('/:id')
  .get(advancedResults(Review, {path: 'bootcamp user',select: 'name description',}),reviewsControll.getReview)
  .put(protect, authorizeKorisnik('user', 'admin'), reviewsControll.updateReview)
  .delete(protect, authorizeKorisnik('user', 'admin'), reviewsControll.deleteReview);

module.exports = router;
