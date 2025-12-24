require("dotenv").config();
const mongoose = require('mongoose');
// const URI = "mongodb://127.0.0.1:27017/mern_admin";

const URI = process.env.MONGODB_URI;
// mongoose.connect(URI);
// const URI = "mongodb+srv://Hardik1317:Hardik@131730@cluster0.ngexpqb.mongodb.net/mern_admin?retryWrites=true&w=majority&appName=Cluster0"
const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log("connection successfull to DB");
    } catch (error) {
        console.error("database Connection failed");
        process.exit(0);
    }
};

module.exports = connectDB;