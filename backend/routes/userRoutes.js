// routes/userRoutes.js


const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// All routes are admin only for user management
router.get("/", authMiddleware, roleMiddleware(["manager"]), userController.getAllUsers);
router.get("/:id", authMiddleware, roleMiddleware(["manager"]), userController.getUserById);
// routes/userRoutes.js
router.put("/:id/role", authMiddleware, roleMiddleware(["manager"]), userController.updateUserRole);
router.delete("/:id", authMiddleware, roleMiddleware(["manager"]), userController.deleteUser);

module.exports = router;
