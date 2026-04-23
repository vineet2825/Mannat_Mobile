const express = require('express');
const router = express.Router();
const { getProducts, addProduct, updateProduct, deleteProduct, searchProducts } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const multer = require('multer');
const path = require('path');

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.get('/', getProducts);
router.get('/search/:query', searchProducts);
router.post('/', protect, admin, upload.single('image'), addProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
