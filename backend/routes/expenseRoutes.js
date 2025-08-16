const express = require("express");
const router = express.Router();
const {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense
} = require("../controllers/expenseController");
const authMiddleware = require("../middleware/authMiddleware");

// Route for getting all expenses and adding a new one
// GET /api/expenses
// POST /api/expenses
router.route("/")
    .get(authMiddleware, getExpenses)
    .post(authMiddleware, addExpense);

// Route for updating or deleting a specific expense by its ID
// PUT /api/expenses/:id
// DELETE /api/expenses/:id
router.route("/:id")
    .put(authMiddleware, updateExpense)
    .delete(authMiddleware, deleteExpense);

module.exports = router;
