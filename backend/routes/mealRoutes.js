// backend/routes/mealRoutes.js

const express = require("express");
const router = express.Router();
const mealController = require("../controllers/mealController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// For saving all meals for a specific day
router.post("/daily-entry", authMiddleware, roleMiddleware(["admin", "manager"]), mealController.saveDailyMeals);


// --- Your existing routes below ---

router.post("/", authMiddleware, mealController.addMeal);
router.get("/", authMiddleware, mealController.getMealsByUser);
router.get("/all", authMiddleware, roleMiddleware(["admin", "manager"]), mealController.getAllMeals);
router.put("/user-meals", authMiddleware, roleMiddleware(["admin", "manager"]), mealController.updateUserMealsForMonth);
router.put("/:id", authMiddleware, mealController.updateMeal);
router.delete("/:id", authMiddleware, mealController.deleteMeal);

module.exports = router;
