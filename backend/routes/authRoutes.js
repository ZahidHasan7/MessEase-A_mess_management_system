// backend/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Routes for both manager and member registration
router.post("/register/manager", authController.registerManager);
router.post("/register/member", authController.registerMember);

// Route for login
router.post("/login", authController.loginUser);

// Routes for profile management (protected)
router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile", authMiddleware, authController.editProfile);

module.exports = router;