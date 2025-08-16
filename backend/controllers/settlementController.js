// backend/controllers/settlementController.js

const Meal = require("../models/Meal");
const Expense = require("../models/Expense");
const User = require("../models/User");
const BazarSchedule = require("../models/BazarSchedule");
const Notice = require("../models/Notice"); // ✅ 1. Import the Notice model

// This function remains unchanged
exports.calculateSettlement = async (req, res) => {
    const { messId } = req.user;
    try {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const meals = await Meal.find({ mess: messId, date: { $gte: startOfMonth, $lte: endOfMonth } });
        const expenses = await Expense.find({ mess: messId, date: { $gte: startOfMonth, $lte: endOfMonth } });
        const users = await User.find({ mess: messId });

        const totalMeals = meals.reduce((sum, m) => sum + m.mealCount, 0);
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        const mealRate = totalMeals === 0 ? 0 : totalExpenses / totalMeals;

        const mealMap = {};
        meals.forEach(m => {
            const uid = m.userId?.toString();
            if (uid) mealMap[uid] = (mealMap[uid] || 0) + m.mealCount;
        });

        const expenseMap = {};
        expenses.forEach(e => {
            const uid = e.addedBy?.toString();
            if (uid) expenseMap[uid] = (expenseMap[uid] || 0) + e.amount;
        });
        
        const report = users.map(user => {
            const uid = user._id.toString();
            const userMeals = mealMap[uid] || 0;
            const userBazarExpense = expenseMap[uid] || 0;
            const mealCost = userMeals * mealRate;
            const balance = userBazarExpense - mealCost;

            return {
                userId: user._id, 
                name: user.name,
                email: user.email,
                meals: userMeals,
                expense: parseFloat(userBazarExpense.toFixed(2)),
                mealCost: parseFloat(mealCost.toFixed(2)),
                balance: parseFloat(balance.toFixed(2)),
            };
        });

        res.status(200).json({
            totalMeals,
            totalExpenses,
            mealRate: parseFloat(mealRate.toFixed(2)),
            report
        });

    } catch (err) {
        console.error("Settlement Calculation Error →", err);
        res.status(500).json({ error: "Server error", message: err.message });
    }
};

// ✅ 2. UPDATED: This function now clears notice data as well
exports.startNewMonth = async (req, res) => {
    const { messId } = req.user;
    try {
        await Meal.deleteMany({ mess: messId });
        await Expense.deleteMany({ mess: messId });
        await BazarSchedule.deleteMany({ mess: messId });
        await Notice.deleteMany({ mess: messId }); // This line is new

        res.status(200).json({ message: "All data for the mess has been cleared for the new month." });
    } catch (err) {
        console.error("Error starting new month:", err);
        res.status(500).json({ error: "Server error while clearing data." });
    }
};