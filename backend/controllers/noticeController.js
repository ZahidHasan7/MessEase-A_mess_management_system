const Notice = require("../models/Notice");

// Get all notices for the user's mess
exports.getNotices = async (req, res) => {
    try {
        const notices = await Notice.find({ mess: req.user.messId })
            .populate("author", "name role") // Get the author's name and role
            .sort({ createdAt: -1 }); // Show newest notices first
        res.json(notices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new notice (manager only)
exports.createNotice = async (req, res) => {
    const { content } = req.body;
    const { id: authorId, messId } = req.user;

    if (!content) {
        return res.status(400).json({ error: "Notice content cannot be empty." });
    }

    try {
        const notice = new Notice({
            content,
            author: authorId,
            mess: messId,
        });
        await notice.save();
        
        // Populate the author details before sending back
        const newNotice = await Notice.findById(notice._id).populate("author", "name role");

        res.status(201).json(newNotice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};