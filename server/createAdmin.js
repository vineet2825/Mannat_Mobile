const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const email = 'ambrosiagaming90@gmail.com';
        let user = await User.findOne({ email });

        if (user) {
            user.role = 'admin';
            user.isVerified = true;
            await user.save();
            console.log(`Updated: ${email} is now an ADMIN.`);
        } else {
            user = await User.create({
                name: 'Admin',
                email: email,
                password: 'Admin@123',
                role: 'admin',
                isVerified: true
            });
            console.log(`Created: ${email} created as ADMIN with password: Admin@123`);
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
