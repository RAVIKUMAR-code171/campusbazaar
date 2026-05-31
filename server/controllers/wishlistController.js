const Wishlist = require('../models/Wishlist');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user.id })
      .populate('listing')
      .sort({ createdAt: -1 });
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const existing = await Wishlist.findOne({
      user: req.user.id,
      listing: req.params.listingId
    });

    if (existing) {
      return res.status(400).json({ message: 'Already in wishlist' });
    }

    const wishlist = new Wishlist({
      user: req.user.id,
      listing: req.params.listingId
    });

    await wishlist.save();
    res.status(201).json({ message: 'Added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({
      user: req.user.id,
      listing: req.params.listingId
    });
    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};