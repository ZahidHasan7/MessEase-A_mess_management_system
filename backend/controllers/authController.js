// backend/controllers/authController.js

const User = require("../models/User");
const Mess = require("../models/Mess");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.registerManager = async (req, res) => {
    const { name, email, password, messName } = req.body;
    try {
        let mess = await Mess.findOne({ name: { $regex: new RegExp(`^${messName}$`, 'i') } });
        if (mess) {
            return res.status(400).json({ error: "A mess with this name already exists." });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "A user with this email already exists." });
        }

        mess = new Mess({ name: messName });
        await mess.save();

        const hashedPassword = await bcrypt.hash(password, 12);
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'manager',
            mess: mess._id
        });
        await user.save();

        mess.manager = user._id;
        await mess.save();

        res.status(201).json({ message: "Manager and new mess created successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.registerMember = async (req, res) => {
    const { name, email, password, messName } = req.body;
    try {
        const mess = await Mess.findOne({ name: { $regex: new RegExp(`^${messName}$`, 'i') } });
        if (!mess) {
            return res.status(404).json({ error: "Mess not found. Please check the mess name." });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "A user with this email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'member',
            mess: mess._id
        });
        await user.save();

        res.status(201).json({ message: "Member registered successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password, messName } = req.body;
    try {
        const mess = await Mess.findOne({ name: { $regex: new RegExp(`^${messName}$`, 'i') } });
        if (!mess) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const user = await User.findOne({ email, mess: mess._id });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const payload = {
            id: user._id,
            role: user.role,
            messId: user.mess
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                messId: user.mess,
                messName: mess.name
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id, mess: req.user.messId }).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.editProfile = async (req, res) => {
    const { name, phone, image } = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.user.id, mess: req.user.messId },
            { name, "profile.phone": phone, "profile.image": image },
            { new: true }
        ).select("-password");
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};