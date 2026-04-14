const Order = require("../models/order-model");
const Service = require("../models/service-model");
const Notification = require("../models/notification-model");

// Book a Service
const bookService = async (req, res, next) => {
    try {
        const { serviceId, notes } = req.body;
        const user = req.user;

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        const existingOrder = await Order.findOne({
            userId: user._id,
            serviceId,
            status: { $in: ["Pending", "Processing"] },
        });

        if (existingOrder) {
            return res.status(400).json({ message: "You already have an active booking for this service." });
        }

        const order = await Order.create({
            userId: user._id,
            serviceId,
            serviceName: service.service,
            servicePrice: service.price,
            serviceProvider: service.provider,
            username: user.username,
            email: user.email,
            phone: user.phone,
            notes: notes || "",
        });

        // Save admin notification
        await Notification.create({
            username: user.username,
            message: `New booking: ${user.username} booked "${service.service}"`,
            type: "booking",
        });

        // Emit real-time event to admin
        const io = req.app.get("io");
        if (io) {
            io.emit("new_order", {
                username: user.username,
                serviceName: service.service,
            });
        }

        return res.status(201).json({ message: "Service booked successfully!", order });
    } catch (error) {
        next(error);
    }
};

// Get logged-in user's bookings
const getMyBookings = async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

// Cancel a booking (by user)
const cancelBooking = async (req, res, next) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.status === "Completed") {
            return res.status(400).json({ message: "Cannot cancel a completed order." });
        }

        order.status = "Cancelled";
        await order.save();
        return res.status(200).json({ message: "Booking cancelled successfully." });
    } catch (error) {
        next(error);
    }
};

module.exports = { bookService, getMyBookings, cancelBooking };
