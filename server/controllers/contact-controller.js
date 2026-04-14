const Contact = require("../models/contact-model");
const Notification = require("../models/notification-model");
const contactForm = async (req, res) => {
    try{
        const response = req.body;
        await Contact.create(response);

        // Store notification in database
        await Notification.create({
            username: response.username,
            message: `New message from ${response.username}`,
            type: "contact"
        });

        // Get socket instance and emit event
        const io = req.app.get("io");
        if (io) {
            io.emit("new_contact_message", {
                username: response.username,
                message: "A new contact message has been received"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Message sent successfully"});
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "message not delivered"});
    }

};

module.exports = contactForm;