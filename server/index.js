const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    app.use(express.static(path.join(__dirname, '../client/dist')));
}

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/qr', require('./routes/qrRoutes'));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Keep the server running instead of closing
});

module.exports = app;
