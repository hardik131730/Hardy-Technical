const User = require("../models/user-model");
const Contact = require("../models/contact-model");
const Service = require("../models/service-model");

const getAllUsers = async(req,res) => {
    try {
        const users = await User.find({},{password:0});
        console.log(users);
        if(!users || users.length ===0){
            return res.status(404).json({message: "No users found"});
        }
        return res.status(200).json(users);
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

const getAllContacts = async(req,res) => {
    try {
        const contacts = await Contact.find();
        console.log(contacts);
        if(!contacts || contacts.length ===0){
            return res.status(404).json({message: "No contacts found"});
        }
        return res.status(200).json(contacts);
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

const getAllServices = async(req,res) => {
    try {
        const services = await Service.find();
        if(!services || services.length ===0){
            return res.status(404).json({message: "No services found"});
        }
        return res.status(200).json(services);
    }catch (error){
        next(error);
    }
}

const addService = async(req,res) => {
    try {
        const {service, price, description, provider} = req.body;
        const serviceCreated = await Service.create({service, price, description, provider});
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

const updateServiceById = async(req,res) => {
    try {
        const id = req.params.id;
        const updateServiceData = req.body;
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

module.exports = {getAllUsers, addUser, getAllContacts, deleteUserById, getUserById, updateUserById, deleteContactById, getAllServices, addService, getServiceById, updateServiceById, deleteServiceById};