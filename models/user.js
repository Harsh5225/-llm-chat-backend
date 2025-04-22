import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  chatHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

export const User = mongoose.model("User", userSchema);
