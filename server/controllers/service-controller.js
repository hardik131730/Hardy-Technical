const Service = require("../models/service-model");

const services = async (req, res)=> {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { service: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { provider: { $regex: search, $options: "i" } }
            ];
        }

        const response = await Service.find(query);
        if(!response){
            return res.status(404).json({msg:"No services found"});
        }
        res.status(200).json({msg:response});
        
    } catch (error) {
        console.log(`services: ${error}`);
        res.status(500).json({msg: "Internal server error"});
    }
}

module.exports = services;