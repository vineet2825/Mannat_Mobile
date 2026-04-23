const express = require('express');
const router = express.Router();
const { createRequest, getMyRequests, getAllRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.get('/my', protect, getMyRequests);
router.get('/', protect, admin, getAllRequests);
router.put('/:id', protect, admin, updateRequestStatus);

module.exports = router;
