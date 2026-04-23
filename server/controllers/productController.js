const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a product
// @route   POST /api/products
exports.addProduct = async (req, res) => {
    const { brand, modelName, type, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    try {
        const product = await Product.create({
            brand,
            modelName,
            type,
            stock,
            image
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.brand = req.body.brand || product.brand;
            product.modelName = req.body.modelName || product.modelName;
            product.type = req.body.type || product.type;
            product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search products by model name
// @route   GET /api/products/search/:query
exports.searchProducts = async (req, res) => {
    try {
        const query = req.params.query;
        // Case-insensitive search using regex
        const products = await Product.find({
            modelName: { $regex: query, $options: 'i' }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
