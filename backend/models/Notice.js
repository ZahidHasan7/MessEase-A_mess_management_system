// Create New File: backend/models/Notice.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const NoticeSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    mess: {
        type: Schema.Types.ObjectId,
        ref: 'Mess',
        required: true,
    },
}, { timestamps: true }); // timestamps adds createdAt and updatedAt automatically

module.exports = mongoose.model("Notice", NoticeSchema);