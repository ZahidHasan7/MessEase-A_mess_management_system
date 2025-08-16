// backend/models/Expense.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

// This schema correctly uses 'addedBy'
const expenseSchema = new Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    item: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    addedBy: { 
        type: Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    mess: {
        type: Schema.Types.ObjectId,
        ref: 'Mess',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);