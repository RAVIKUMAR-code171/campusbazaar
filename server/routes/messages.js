const express = require('express');
const router = express.Router();
const { getMessages, getConversations, sendMessage } = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.get('/conversations', auth, getConversations);
router.get('/:listingId/:otherUserId', auth, getMessages);
router.post('/', auth, sendMessage);

module.exports = router;