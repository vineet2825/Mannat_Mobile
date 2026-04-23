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

const handleUpload = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Multer Upload Error:', err.message);
            // Even if upload fails (e.g. read-only filesystem on Vercel), 
            // we continue without the image if it's optional, or return error.
            // For now, let's just log and continue. The controller will handle missing req.file.
            return next();
        }
        next();
    });
};

router.get('/', getProducts);
router.get('/search/:query', searchProducts);
router.post('/', protect, admin, handleUpload, addProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
