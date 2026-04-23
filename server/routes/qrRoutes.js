const express = require('express');
const router = express.Router();
const { generateQR } = require('../controllers/qrController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/generate', protect, admin, generateQR);

module.exports = router;
