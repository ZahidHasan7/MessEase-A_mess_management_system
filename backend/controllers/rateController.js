// controllers/rateController.js
const Expense = require("../models/Expense");
const Meal = require("../models/Meal");
const Rate = require("../models/Rate");

// Calculate Meal Rate for a Given Month
toMonthString = (date) => date.toISOString().substring(0, 7);

exports.calculateMealRate = async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    // Get all expenses for the current month
    const expenses = await Expense.find({
      date: { $gte: start, $lte: end },
    });

    const totalExpense = expenses.reduce((acc, exp) => acc + exp.amount, 0);

    // Get all meals for the current month
    const meals = await Meal.find({
      date: { $gte: start, $lte: end },
    });

    const totalMeals = meals.reduce((acc, meal) => acc + meal.mealCount, 0);

    const ratePerMeal = totalMeals > 0 ? (totalExpense / totalMeals).toFixed(2) : 0;

    // Save or update the rate in the DB
    const monthKey = toMonthString(now);
    const existing = await Rate.findOne({ month: monthKey });

    if (existing) {
      existing.totalExpense = totalExpense;
      existing.totalMeals = totalMeals;
      existing.ratePerMeal = ratePerMeal;
      await existing.save();
    } else {
      const rate = new Rate({
        month: monthKey,
        totalExpense,
        totalMeals,
        ratePerMeal,
      });
      await rate.save();
    }

    res.json({
      month: monthKey,
      totalExpense,
      totalMeals,
      ratePerMeal,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
