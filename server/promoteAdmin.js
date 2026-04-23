const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const promoteAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const email = 'ambrosiagaming90@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            user.role = 'admin';
            user.isVerified = true; // Also verify them
            await user.save();
            console.log(`Success: ${email} is now an ADMIN.`);
        } else {
            console.log(`Error: User with email ${email} not found. Please register first!`);
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

promoteAdmin();
