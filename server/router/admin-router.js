const express = require("express");
const adminController = require("../controllers/admin-controller");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");
const upload = require("../middlewares/upload-middleware");

router.route("/stats").get(authMiddleware, adminMiddleware, adminController.getAdminStats);
router.route("/users").get(authMiddleware, adminMiddleware, adminController.getAllUsers);
router.route("/users/export").get(authMiddleware, adminMiddleware, adminController.exportUsers);
router.route("/users/add").post(authMiddleware, adminMiddleware, adminController.addUser);
router.route("/users/:id").get(authMiddleware, adminMiddleware, adminController.getUserById);
router.route("/users/update/:id").patch(authMiddleware, adminMiddleware, adminController.updateUserById);
router.route("/users/delete/:id").delete(authMiddleware, adminMiddleware, adminController.deleteUserById);

router.route("/contacts").get(authMiddleware, adminMiddleware, adminController.getAllContacts);
router.route("/contacts/delete/:id").delete(authMiddleware, adminMiddleware, adminController.deleteContactById);

router.route("/services").get(authMiddleware, adminMiddleware, adminController.getAllServices);
router.route("/services/add").post(authMiddleware, adminMiddleware, upload.single("image"), adminController.addService);
router.route("/services/:id").get(authMiddleware, adminMiddleware, adminController.getServiceById);
router.route("/services/update/:id").patch(authMiddleware, adminMiddleware, upload.single("image"), adminController.updateServiceById);
router.route("/services/delete/:id").delete(authMiddleware, adminMiddleware, adminController.deleteServiceById);

router.route("/notifications").get(authMiddleware, adminMiddleware, adminController.getAllNotifications);
router.route("/notifications/mark-read/:id").patch(authMiddleware, adminMiddleware, adminController.markNotificationAsRead);
router.route("/notifications/mark-all-read").patch(authMiddleware, adminMiddleware, adminController.markAllNotificationsAsRead);
router.route("/notifications/delete/:id").delete(authMiddleware, adminMiddleware, adminController.deleteNotification);

router.route("/orders").get(authMiddleware, adminMiddleware, adminController.getAllOrders);
router.route("/orders/export").get(authMiddleware, adminMiddleware, adminController.exportOrders);
router.route("/orders/status/:id").patch(authMiddleware, adminMiddleware, adminController.updateOrderStatus);
router.route("/orders/delete/:id").delete(authMiddleware, adminMiddleware, adminController.deleteOrder);

module.exports = router;