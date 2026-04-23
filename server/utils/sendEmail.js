const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Fallback if credentials are not set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('--- OTP FALLBACK (NO EMAIL CREDENTIALS) ---');
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.text}`);
        console.log('-----------------------------------------');
        return;
    }

    const mailOptions = {
        from: `Mannat Mobile Shop <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
