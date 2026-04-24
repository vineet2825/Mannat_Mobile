const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Connect to Database
connectDB();

// Create uploads directory if it doesn't exist (local dev only)
if (!process.env.VERCEL) {
    const uploadsDir = path.join(__dirname, 'uploads');
    try {
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
            console.log('Created uploads directory');
        }
    } catch (err) {
        console.warn('Could not create uploads directory:', err.message);
    }
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

// API Router
const apiRouter = express.Router();

// Mount Routes
apiRouter.use('/auth', require('./routes/authRoutes'));
apiRouter.use('/products', require('./routes/productRoutes'));
apiRouter.use('/requests', require('./routes/requestRoutes'));
apiRouter.use('/qr', require('./routes/qrRoutes'));

// Mount API Router to /api
app.use('/api', apiRouter);

// Only listen if not running on Vercel
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('\n' + '!'.repeat(50));
    console.error('🔥 UNHANDLED ERROR');
    console.error('Message:', err.message);
    if (err.stack) console.error('Stack:', err.stack.split('\n')[1]);
    console.error('!'.repeat(50) + '\n');

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

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
