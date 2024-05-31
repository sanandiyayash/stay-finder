const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const Listing = require("../models/listing");
const { vallidateReview, isloggedIn, isReviewAuthor } = require('../middleware.js');
const reviewController = require('../controllers/review.js');

///reviews
router.post(
  "/", isloggedIn,
  vallidateReview,
  wrapAsync(reviewController.createReview)
);

//delete review route
router.delete(
  "/:reviewId", isloggedIn, isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
