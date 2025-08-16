// backend/controllers/expenseController.js

const Expense = require("../models/Expense");

// This controller correctly uses 'addedBy'
exports.addExpense = async (req, res) => {
    const { date, item, amount, addedBy } = req.body;
    const { messId } = req.user;

    if (!addedBy) {
        return res.status(400).json({ error: "Please select who paid for the expense." });
    }

    try {
        const newExpense = new Expense({
            date,
            item,
            amount,
            addedBy,
            mess: messId,
        });
        await newExpense.save();
        res.status(201).json({ message: "Expense added successfully", expense: newExpense });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ mess: req.user.messId }).populate("addedBy", "name").sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateExpense = async (req, res) => {
    const { id } = req.params;
    const { item, amount, date, addedBy } = req.body;

    try {
        const updated = await Expense.findOneAndUpdate(
            { _id: id, mess: req.user.messId },
            { item, amount, date, addedBy },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Expense not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Expense.findOneAndDelete({ _id: id, mess: req.user.messId });
        if (!deleted) return res.status(404).json({ error: "Expense not found" });
        res.json({ message: "Expense deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};