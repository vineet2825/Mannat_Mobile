const express = require('express');
const router = express.Router();
const { register, verifyOtp, login, deleteUser, getUsers, toggleBlockUser, adminDeleteUser, getDbStatus } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/db-status', getDbStatus);
router.post('/register', register);
router.post('/verify', verifyOtp);
router.post('/login', login);
router.delete('/profile', protect, deleteUser);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id/block', protect, admin, toggleBlockUser);
router.delete('/users/:id', protect, admin, adminDeleteUser);

module.exports = router;
