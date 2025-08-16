// backend/controllers/bazarScheduleController.js

const BazarSchedule = require("../models/BazarSchedule");

exports.createSchedule = async (req, res) => {
    const { userId, date } = req.body;
    const { messId } = req.user;
    try {
        const schedule = new BazarSchedule({ userId, date, mess: messId });
        await schedule.save();
        res.status(201).json({ message: "Bazar schedule created", schedule });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSchedule = async (req, res) => {
    try {
        const schedules = await BazarSchedule.find({ mess: req.user.messId })
            .populate("userId", "name")
            .sort({ date: 1 });
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserSchedule = async (req, res) => {
    try {
        const schedules = await BazarSchedule.find({ userId: req.user.id, mess: req.user.messId }).sort({ date: 1 });
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateSchedule = async (req, res) => {
    const { id } = req.params;
    const { userId, date } = req.body;
    try {
        const updated = await BazarSchedule.findOneAndUpdate(
            { _id: id, mess: req.user.messId },
            { userId, date },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Schedule not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteSchedule = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await BazarSchedule.findOneAndDelete({ _id: id, mess: req.user.messId });
        if (!deleted) return res.status(404).json({ error: "Schedule not found" });
        res.json({ message: "Schedule deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};