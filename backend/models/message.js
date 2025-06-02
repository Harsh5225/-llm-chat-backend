import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "model"], // either user or model (AI)
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Message = mongoose.model("Message", messageSchema);
