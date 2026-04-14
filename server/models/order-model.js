const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },
    serviceName: { type: String, required: true },
    servicePrice: { type: String, required: true },
    serviceProvider: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String, default: "" },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Completed", "Cancelled"],
        default: "Pending",
    },
    createdAt: { type: Date, default: Date.now },
});

const Order = model("Order", orderSchema);

module.exports = Order;
