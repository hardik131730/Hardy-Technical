const { Schema, model } = require("mongoose");

const notificationSchema = new Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: "contact" },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Notification = model("Notification", notificationSchema);

module.exports = Notification;
