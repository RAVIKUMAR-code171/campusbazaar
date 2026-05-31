const express = require('express');
const router = express.Router();
const { getRequests, createRequest, respondToRequest, deleteRequest } = require('../controllers/requestController');
const auth = require('../middleware/auth');

router.get('/', getRequests);
router.post('/', auth, createRequest);
router.post('/:id/respond', auth, respondToRequest);
router.delete('/:id', auth, deleteRequest);

module.exports = router;