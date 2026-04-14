const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controller");
const {signupSchema, loginSchema} = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");
const authMiddleware = require("../middlewares/auth-middleware");
const upload = require("../middlewares/upload-middleware");

router.route("/").get(authControllers.home);
router
    .route("/register")
    .post(validate(signupSchema),authControllers.register);
router
    .route("/login")
    .post(validate(loginSchema),authControllers.login);

router.route("/user").get(authMiddleware, authControllers.user);
router.route("/user/update-profile").patch(authMiddleware, upload.single("image"), authControllers.updateProfile);

router.route("/forgot-password").post(authControllers.forgotPassword);
router.route("/reset-password").post(authControllers.resetPassword);

module.exports = router;
