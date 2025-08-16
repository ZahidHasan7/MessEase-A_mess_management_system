// backend/routes/settlementRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware"); // Assuming you have this
const { calculateSettlement, startNewMonth } = require("../controllers/settlementController");

// Existing route to get the settlement report
router.get("/", auth, calculateSettlement);

// ✅ NEW ROUTE: To clear data for a new month (manager only)
router.delete("/new-month", auth, roleMiddleware(["manager"]), startNewMonth);

module.exports = router;
