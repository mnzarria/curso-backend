import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
    user: {
        type: String,
    },
    message: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export const messagesModel = mongoose.model('Messages', messagesSchema);