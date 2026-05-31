const Listing = require('../models/Listing');

// Get all listings
exports.getListings = async (req, res) => {
  try {
    const { category, type, college, search } = req.query;
    
    let filter = {};
    
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (college) filter.college = college;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const listings = await Listing.find(filter)
      .populate('seller', 'name college')
      .sort({ createdAt: -1 });

    res.status(200).json(listings);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single listing
exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'name college email');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json(listing);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create listing
exports.createListing = async (req, res) => {
  try {
    const { title, description, price, type, category, condition, college, image } = req.body;

    const listing = new Listing({
      title,
      description,
      price,
      type,
      category,
      condition,
      college,
      image,
      seller: req.user.id
    });

    await listing.save();

    res.status(201).json(listing);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete listing
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await listing.deleteOne();

    res.status(200).json({ message: 'Listing deleted' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};