const nodemailer = require("nodemailer");

// Create a transporter object
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Sends a password reset email with the provided OTP.
 * @param {string} email - Recipient's email address
 * @param {string} otp - The 6-digit One Time Password
 */
const sendPasswordResetEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: `"HardyTechnical Security" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset Request",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0b10; color: #ffffff; padding: 40px; border-radius: 10px; border: 1px solid #1a1c29;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #646cff; margin: 0;">HardyTechnical</h1>
                    </div>
                    <div style="background-color: #12141d; padding: 30px; border-radius: 8px;">
                        <h2 style="margin-top: 0; color: #ffffff;">Password Reset Request</h2>
                        <p style="color: #a0a0a0; font-size: 16px; line-height: 1.5;">
                            We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed. This OTP is valid for <strong>10 minutes</strong>.
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #646cff; background: rgba(100, 108, 255, 0.1); padding: 15px 30px; border-radius: 8px; border: 1px solid rgba(100, 108, 255, 0.2); display: inline-block;">
                                ${otp}
                            </span>
                        </div>
                        <p style="color: #a0a0a0; font-size: 14px; text-align: center; margin-bottom: 0;">
                            If you did not request a password reset, please ignore this email or contact support if you have concerns.
                        </p>
                    </div>
                    <div style="text-align: center; margin-top: 30px; color: #666666; font-size: 12px;">
                        <p>&copy; ${new Date().getFullYear()} HardyTechnical. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent: " + info.response);
        return true;
    } catch (error) {
        console.error("Error sending password reset email: ", error);
        return false;
    }
};

module.exports = {
    sendPasswordResetEmail
};
