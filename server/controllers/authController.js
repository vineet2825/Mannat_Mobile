const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user & Send OTP
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database connecting... please try again in a few seconds.' });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

        user = await User.create({
            name,
            email,
            password,
            otp,
            otpExpires
        });

        // Log OTP to console
        console.log('\n' + '='.repeat(40));
        console.log(`🔑 NEW OTP GENERATED`);
        console.log(`📧 User: ${user.email}`);
        console.log(`🔢 OTP:  ${otp}`);
        console.log('='.repeat(40) + '\n');

        try {
            await sendEmail({
                to: user.email,
                subject: 'Your Registration OTP',
                text: `Your OTP for Mannat Mobile Shop is: ${otp}. It expires in 10 minutes.`
            });
            res.status(201).json({ 
                message: 'OTP sent to email. (Dev Mode: OTP included in this response)', 
                otp: otp 
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError.message);
            res.status(201).json({ 
                message: 'Registration successful. (Email service error: OTP included in this response)',
                otp: otp,
                devNote: 'OTP sent to browser console'
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database connecting... please try again in a few seconds.' });
        }
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            if (!user.isVerified) {
                console.log('\n' + '!'.repeat(40));
                console.log(`⚠️  VERIFICATION REQUIRED`);
                console.log(`📧 User: ${user.email}`);
                console.log(`🔢 OTP:  ${user.otp}`);
                console.log('!'.repeat(40) + '\n');
                return res.status(401).json({ 
                    message: 'Please verify your email first. (Dev Mode: OTP included in this response)',
                    otp: user.otp 
                });
            }

            if (user.isBlocked) {
                return res.status(403).json({ message: 'Your account has been blocked by the administrator.' });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user account
// @route   DELETE /api/auth/profile
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User account deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/auth/users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle block/unblock user
// @route   PUT /api/auth/users/:id/block
exports.toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (user.role === 'admin') return res.status(400).json({ message: 'Cannot block an admin' });

        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin delete user
// @route   DELETE /api/auth/users/:id
exports.adminDeleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete an admin account' });

        await user.deleteOne();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
