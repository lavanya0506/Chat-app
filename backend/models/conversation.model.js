import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],
    conversation: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: []
        }
    ]

}, {timestamps: true})

export const Conversation = mongoose.model("Conversation", conversationSchema);