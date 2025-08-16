// backend/controllers/userController.js
const User = require("../models/User");

// ✅ UPDATED: Get All Users is now scoped to the manager's mess
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ mess: req.user.messId }).select("-password").sort({ name: 1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ UPDATED: Get User By ID is now scoped to the manager's mess
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ _id: id, mess: req.user.messId }).select("-password");
        if (!user) return res.status(404).json({ error: "User not found in your mess" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ UPDATED: Update User Role is now scoped to the manager's mess
exports.updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!["manager", "member"].includes(role)) {
        return res.status(400).json({ error: "Invalid role specified" });
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: id, mess: req.user.messId },
            { role },
            { new: true }
        ).select("-password");

        if (!updatedUser) return res.status(404).json({ error: "User not found in your mess" });
        res.json({ message: "User role updated", user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ UPDATED: Delete User is now scoped to the manager's mess
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findOneAndDelete({ _id: id, mess: req.user.messId });
        if (!deletedUser) return res.status(404).json({ error: "User not found in your mess" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};