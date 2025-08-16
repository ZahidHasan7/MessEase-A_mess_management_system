// 1. Update this file: backend/routes/index.js

const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/meals", require("./mealRoutes"));
router.use("/expenses", require("./expenseRoutes"));
router.use("/schedule", require("./bazarScheduleRoutes"));
router.use("/settlement", require("./settlementRoutes"));
router.use("/users", require("./userRoutes"));
router.use("/rate", require("./rateRoutes"));
// ✅ NEW: Add this line to activate your notice board API
router.use("/notices", require("./noticeRoutes"));

module.exports = router;