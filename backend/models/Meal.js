// models/Meal.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const mealSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    mealCount: { type: Number, required: true },
    // ✅ NEW: Link each meal entry to a specific mess
    mess: {
        type: Schema.Types.ObjectId,
        ref: 'Mess',
        required: true,
    }
});

module.exports = mongoose.model("Meal", mealSchema);
