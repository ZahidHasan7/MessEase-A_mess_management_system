// Create New File: backend/routes/noticeRoutes.js

const express = require("express");
const router = express.Router();
const noticeController = require("../controllers/noticeController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Any authenticated user can get notices
router.get("/", authMiddleware, noticeController.getNotices);

// Only managers can create a notice
router.post("/", authMiddleware, roleMiddleware(["manager"]), noticeController.createNotice);

module.exports = router;