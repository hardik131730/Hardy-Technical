const User = require("../models/user-model");
const Contact = require("../models/contact-model");
const Service = require("../models/service-model");

const getAllUsers = async(req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";

        const query = search ? {
            $or: [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } }
            ]
        } : {};

        const totalUsers = await User.countDocuments(query);
        const users = await User.find(query, { password: 0 })
            .skip(skip)
            .limit(limit);

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        return res.status(200).json({
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page
        });
    } catch (error) {
        next(error);
    }
}

const addUser = async(req, res) => {
    try {
        const { username, email, phone, password } = req.body;
        
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const userCreated = await User.create({
            username,
            email,
            phone,
            password
        });

        res.status(201).json({
            message: "User registered successfully",
            userId: userCreated._id.toString(),
        });

    } catch (error) {
        next(error);
    }
}

const getAllContacts = async(req,res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page-1) * limit;
        const search = req.query.search || "";

        const query = search ? {
            $or: [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { message: { $regex: search, $options: "i" } }
            ]
        } : {};

        const totalContacts = await Contact.countDocuments(query);
        const contacts = await Contact.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "users",
                    localField: "email",
                    foreignField: "email",
                    as: "user_details"
                }
            },
            {
                $addFields: {
                    image: { $arrayElemAt: ["$user_details.image", 0] }
                }
            },
            { $project: { user_details: 0 } },
            { $sort: { _id: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]);

        if(!contacts || contacts.length ===0){
            return res.status(404).json({message: "No contacts found"});
        }
        return res.status(200).json({
            contacts,
            totalContacts,
            totalPages: Math.ceil(totalContacts / limit),
            currentPage: page
        });
    }catch (error){
        next(error);
    }
}

const deleteUserById = async(req,res) => {
    try {
        const id = req.params.id;
        await User.deleteOne({_id: id});
        return res.status(200).json({message: "User deleted successfully"});
    } catch (error) {
        next(error);
    }
}

const getUserById = async(req,res) => {
    try {
        const id = req.params.id;
        const data = await User.findOne({_id: id}, {password: 0});
        return res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}

const updateUserById = async(req,res) => {
    try {
        const id = req.params.id;
        const updateUserData = req.body;
        const updatedData = await User.updateOne({_id: id}, {$set: updateUserData});
        return res.status(200).json(updatedData);
    } catch (error) {
        next(error);
    }
}

const deleteContactById = async(req,res) => {
    try {
        const id = req.params.id;
        await Contact.deleteOne({_id: id});
        return res.status(200).json({message: "Contact deleted successfully"});
    } catch (error) {
        next(error);
    }
}

const getAllServices = async(req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";

        const query = search ? {
            $or: [
                {service: {$regex: search, $options: "i"}},
                {price: {$regex: search, $options: "i"}},
                {description: {$regex: search, $options: "i"}},
                {provider: {$regex: search, $options: "i"}}
            ]
        } : {};

        const totalServices = await Service.countDocuments(query);
        const services = await Service.find(query).skip(skip).limit(limit);
        if(!services || services.length ===0){
            return res.status(404).json({message: "No services found"});
        }
        return res.status(200).json({
            services,
            totalServices,
            totalPages: Math.ceil(totalServices / limit),
            currentPage: page
        });
    }catch (error){
        next(error);
    }
}

const addService = async(req, res, next) => {
    try {
        const {service, price, description, provider} = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : "";
        const serviceCreated = await Service.create({service, price, description, provider, image});
        return res.status(201).json({message : "Service added successfully"})
    } catch (error) {
        next(error);
    }
}

const getServiceById = async(req,res) => {
    try {
        const id = req.params.id;
        const data = await Service.findOne({_id: id});
        return res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}

const updateServiceById = async(req, res, next) => {
    try {
        const id = req.params.id;
        const updateServiceData = { ...req.body };
        if (req.file) {
            updateServiceData.image = `/uploads/${req.file.filename}`;
        }
        const updatedData = await Service.updateOne({_id: id}, {$set: updateServiceData});
        return res.status(200).json(updatedData);
    } catch (error) {
        next(error);
    }
}

const deleteServiceById = async(req,res) => {
    try {
        const id = req.params.id;
        await Service.deleteOne({_id: id});
        return res.status(200).json({message: "Service deleted successfully"});
    } catch (error) {
        next(error);
    }
}

const getAdminStats = async (req, res, next) => {
    try {
        const userCount = await User.countDocuments();
        const contactCount = await Contact.countDocuments();
        const serviceCount = await Service.countDocuments();

        return res.status(200).json({
            users: userCount,
            contacts: contactCount,
            services: serviceCount
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllUsers, 
    addUser, 
    getAllContacts, 
    deleteUserById, 
    getUserById, 
    updateUserById, 
    deleteContactById, 
    getAllServices, 
    addService, 
    getServiceById, 
    updateServiceById, 
    deleteServiceById,
    getAdminStats
};