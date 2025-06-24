const nodemailer = require('nodemailer');
require('dotenv').config();

const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Digital Business Card Generator" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Your OTP Code for Verification',
        html: `
            <h1>OTP Verification</h1>
            <p>Your OTP code is: <strong>${otp}</strong></p>
            <p>This code is valid for 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
        `
    };
    
    await transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;
// This function sends an OTP email to the user using Nodemailer.