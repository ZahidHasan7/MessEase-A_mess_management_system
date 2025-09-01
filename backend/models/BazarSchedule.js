// models/BazarSchedule.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const scheduleSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    // ✅ NEW: Link each schedule to a specific mess
    mess: {
        type: Schema.Types.ObjectId,
        ref: 'Mess',
        required: true,
    }
});

module.exports = mongoose.model("BazarSchedule", scheduleSchema);
