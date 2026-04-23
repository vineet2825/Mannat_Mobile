const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('\n' + '!'.repeat(50));
        console.error(`❌ DATABASE CONNECTION ERROR: ${error.message}`);
        console.error('⚠️  The server is running but database-dependent features will fail.');
        console.error('👉 Please check your MONGODB_URI in .env');
        console.error('!'.repeat(50) + '\n');
    }
};

module.exports = connectDB;
