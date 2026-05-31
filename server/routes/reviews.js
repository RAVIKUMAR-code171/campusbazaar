const express = require('express');
const router = express.Router();
const { getReviews, createReview } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.get('/:listingId', getReviews);
router.post('/:listingId', auth, createReview);

module.exports = router;