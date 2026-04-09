const User = require('../models/user-model');
const bcrypt = require('bcryptjs');

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

module.exports = { home, register, login, user, updateProfile };
