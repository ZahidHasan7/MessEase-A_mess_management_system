// backend/routes/bazarScheduleRoutes.js

const express = require("express");
const router = express.Router();
const bazarScheduleController = require("../controllers/bazarScheduleController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Only managers can create, update, or delete schedules
router.post("/", authMiddleware, roleMiddleware(["admin", "manager"]), bazarScheduleController.createSchedule);
router.put("/:id", authMiddleware, roleMiddleware(["admin", "manager"]), bazarScheduleController.updateSchedule);
router.delete("/:id", authMiddleware, roleMiddleware(["admin", "manager"]), bazarScheduleController.deleteSchedule);

// ✅ CORRECTED: All authenticated users (members and managers) can view the full schedule
router.get("/", authMiddleware, bazarScheduleController.getSchedule);

// Any authenticated user can see their own schedule
router.get("/user", authMiddleware, bazarScheduleController.getUserSchedule);

module.exports = router;
