const User = require('../models/user-model');
const Notification = require('../models/notification-model');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const emailService = require('../utils/emailService');

const home = async (req, res) => {
    try{
        res.status(200).send('Welcome to Home!');
    }catch(error){
        console.log(error);
    }
};

const register = async(req, res) => {
    try{
        console.log(req.body);
        const {username , email, phone, password} = req.body;
        
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({message: "User already exists"});
        }

        // const saltRound = 10;
        // const hash_password = await bcrypt.hash(password, saltRound);

        const userCreated = await User.create({username , email, phone, password});

        // Store notification in database
        await Notification.create({
            username: username,
            message: `New user registration: ${username}`,
            type: "registration"
        });

        // Get socket instance and emit event
        const io = req.app.get("io");
        if (io) {
            io.emit("new_user_registration", {
                username: username,
                message: "A new user has registered"
            });
        }
        
        res.status(201).json({
            msg: "registration successfull" , 
            token: await userCreated.generateToken(), 
            userId:userCreated._id.toString(),
    });
    }catch(error){
        // res.status(500).json({message: "Internal Server Error"});
        next(error);
    }
};

//User login logic 
const login = async (req, res) => {
    try{
        const { email, password } = req.body;

        const userExist = await User.findOne({ email });

        if(!userExist){
            return res.status(400).json({ message : "Invalid Credetials"});
        }
        
        //const user = await bcrypt.compare(password, userExist.password);
        const user = await userExist.comparePassword(password);

        if(user){
            res.status(200).json({
                msg: "login successfull" , 
                token: await userExist.generateToken(), 
                userId:userExist._id.toString(),
            });
        }else{
            res.status(401).json({message:"Invalid email or password"});
        }

    }catch(error){
        // res.status(500).json({message: "Internal Server Error"});
        next(error);
    }
};

// to send user data = User logic
const user = async(req,res) => {
    try {
        const userData = req.user;
        return res.status(200).json({userData});
    } catch (error) {
        console.log(`error from the user route: ${error}`);
    }
}

// Update user profile (name, phone, profile picture)
const updateProfile = async(req, res, next) => {
    try {
        const userId = req.user._id;
        const { username, phone } = req.body;
        const updateData = {};

        if (username) updateData.username = username;
        if (phone) updateData.phone = phone;
        if (req.file) updateData.image = `/uploads/${req.file.filename}`;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, select: "-password" }
        );

        return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        next(error);
    }
};

// Forgot Password Flow - Request OTP
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Return 200 even if user not found for security purposes
            return res.status(200).json({ message: "If an account with that email exists, an OTP will be sent." });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Expiry time (10 minutes)
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

        // Update User Model with OTP data
        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpiry = otpExpiry;
        await user.save();

        // Send Email
        const emailSent = await emailService.sendPasswordResetEmail(user.email, otp);

        if (!emailSent) {
            return res.status(500).json({ message: "Error sending email. Please try again later." });
        }

        return res.status(200).json({ message: "OTP sent successfully to your email." });
    } catch (error) {
        next(error);
    }
};

// Reset Password
const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify OTP logic
        if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP provided" });
        }

        // Verify Expiry
        if (new Date() > user.resetPasswordOtpExpiry) {
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        // Valid OTP, update password
        user.password = newPassword;
        // Clear OTP fields
        user.resetPasswordOtp = null;
        user.resetPasswordOtpExpiry = null;
        
        // We use save() to trigger the 'pre' save hook which hashes the password!
        await user.save();

        return res.status(200).json({ message: "Password has been successfully reset." });
    } catch (error) {
        next(error);
    }
};

module.exports = { home, register, login, user, updateProfile, forgotPassword, resetPassword };
