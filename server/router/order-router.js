const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order-controller");
const authMiddleware = require("../middlewares/auth-middleware");

router.route("/book").post(authMiddleware, orderController.bookService);
router.route("/my-bookings").get(authMiddleware, orderController.getMyBookings);
router.route("/cancel/:id").patch(authMiddleware, orderController.cancelBooking);

module.exports = router;
