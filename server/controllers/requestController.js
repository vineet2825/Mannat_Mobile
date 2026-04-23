const Request = require('../models/Request');
const Product = require('../models/Product');

// @desc    Create a new request
// @route   POST /api/requests
exports.createRequest = async (req, res) => {
    const { productId } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock <= 0) {
            return res.status(400).json({ message: 'Product out of stock' });
        }

        const request = await Request.create({
            user: req.user._id,
            product: productId
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user's requests
// @route   GET /api/requests/my
exports.getMyRequests = async (req, res) => {
    try {
        const requests = await Request.find({ user: req.user._id }).populate('product');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all requests (Admin)
// @route   GET /api/requests
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find({}).populate('user', 'name email').populate('product');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update request status
// @route   PUT /api/requests/:id
exports.updateRequestStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const request = await Request.findById(req.params.id);

        if (request) {
            if (status === 'Approved' && request.status !== 'Approved') {
                const product = await Product.findById(request.product);
                if (product.stock > 0) {
                    product.stock -= 1;
                    await product.save();
                } else {
                    return res.status(400).json({ message: 'Out of stock, cannot approve' });
                }
            }

            request.status = status;
            const updatedRequest = await request.save();
            res.json(updatedRequest);
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
