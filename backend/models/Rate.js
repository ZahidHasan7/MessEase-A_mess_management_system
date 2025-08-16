// models/Rate.js



const mongoose = require("mongoose");

const rateSchema = new mongoose.Schema({
  month: String, // e.g., "2025-07"
  totalExpense: Number,
  totalMeals: Number,
  ratePerMeal: Number,
});

module.exports = mongoose.model("Rate", rateSchema);
