const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    modelName: { type: String, required: true },
    type: { type: String, enum: ['Cover', 'Tempered'], required: true },
    stock: { type: Number, required: true, default: 0 },
    image: { type: String }, // Optional image URL
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
