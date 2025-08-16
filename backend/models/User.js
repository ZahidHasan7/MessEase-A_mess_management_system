// models/User.js


const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["manager", "member"], default: "member" },
    profile: {
        phone: String,
        image: String,
    },
    // ✅ NEW: Link each user to a specific mess
    mess: {
        type: Schema.Types.ObjectId,
        ref: 'Mess',
        required: true,
    }
});

module.exports = mongoose.model("User", userSchema);
