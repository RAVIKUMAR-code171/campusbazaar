const Review = require('../models/Review');

// Get reviews for a listing
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId })
      .populate('reviewer', 'name college')
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { rating, comment, seller } = req.body;

    // Check if already reviewed
    const existing = await Review.findOne({
      listing: req.params.listingId,
      reviewer: req.user.id
    });

    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this listing' });
    }

    const review = new Review({
      listing: req.params.listingId,
      reviewer: req.user.id,
      seller,
      rating,
      comment
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};