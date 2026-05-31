const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const auth = require('../middleware/auth');

router.get('/', auth, getWishlist);
router.post('/:listingId', auth, addToWishlist);
router.delete('/:listingId', auth, removeFromWishlist);

module.exports = router;