// routes/rateRoutes.js



const express = require("express");
const router = express.Router();
const rateController = require("../controllers/rateController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/calculate", authMiddleware, rateController.calculateMealRate);

module.exports = router;
