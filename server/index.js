const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Connect to Database
connectDB();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('Created uploads directory');
}

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

// Only listen if not running on Vercel
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    if (err.stack) console.error(err.stack);
});

process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    if (err.stack) console.error(err.stack);
});

module.exports = app;
