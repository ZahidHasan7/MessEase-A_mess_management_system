// backend/controllers/mealController.js

const Meal = require("../models/Meal");

// ✅ CORRECTED: This is the complete and mess-aware version of the controller.
exports.saveDailyMeals = async (req, res) => {
    const { date, meals } = req.body;
    const { messId } = req.user;

    if (!date || !meals) {
        return res.status(400).json({ error: "Date and meals array are required." });
    }

    try {
        const operations = meals.map(({ userId, mealCount }) => ({
            updateOne: {
                filter: { userId, date: new Date(date), mess: messId },
                update: { $set: { userId, date: new Date(date), mealCount, mess: messId } },
                upsert: true,
            },
        }));

        await Meal.deleteMany({ date: new Date(date), mealCount: 0, mess: messId });
        if (operations.length > 0) {
            await Meal.bulkWrite(operations);
        }

        res.status(200).json({ message: "Meals for the day saved successfully." });
    } catch (err) {
        res.status(500).json({ error: "Server error while saving daily meals." });
    }
};

exports.addMeal = async (req, res) => {
    const { userId, date, mealCount } = req.body;
    const { messId } = req.user;
    try {
        const meal = new Meal({ userId, date, mealCount, mess: messId });
        await meal.save();
        res.status(201).json({ message: "Meal added successfully", meal });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMealsByUser = async (req, res) => {
    try {
        const meals = await Meal.find({ userId: req.user.id, mess: req.user.messId }).sort({ date: -1 });
        res.json(meals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllMeals = async (req, res) => {
    try {
        const meals = await Meal.find({ mess: req.user.messId }).populate("userId", "name").sort({ date: -1 });
        res.json(meals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateMeal = async (req, res) => {
    const { mealCount } = req.body;
    const { id } = req.params;
    try {
        const updatedMeal = await Meal.findOneAndUpdate({ _id: id, mess: req.user.messId }, { mealCount }, { new: true });
        if (!updatedMeal) return res.status(404).json({ error: "Meal not found" });
        res.json(updatedMeal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUserMealsForMonth = async (req, res) => {
    const { userId, newTotalMeals } = req.body;
    const { messId } = req.user;
    const totalToSet = Number(newTotalMeals);

    if (isNaN(totalToSet) || totalToSet < 0) {
        return res.status(400).json({ error: "Invalid total meal count provided." });
    }

    try {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        await Meal.deleteMany({
            userId: userId,
            date: { $gte: startOfMonth, $lte: endOfMonth },
            mess: messId
        });

        if (totalToSet > 0) {
            const newMealEntry = new Meal({
                userId,
                date: startOfMonth,
                mealCount: totalToSet,
                mess: messId
            });
            await newMealEntry.save();
        }
        
        res.status(200).json({ message: `Successfully set total meals for user to ${totalToSet}.` });
    } catch (err) {
        res.status(500).json({ error: "Server error while updating meals." });
    }
};

exports.deleteMeal = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedMeal = await Meal.findOneAndDelete({ _id: id, mess: req.user.messId });
        if (!deletedMeal) return res.status(404).json({ error: "Meal not found" });
        res.json({ message: "Meal deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};