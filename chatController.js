import { GoogleGenAI } from "@google/genai";
import { User } from "./models/user.js";
import { Message } from "./models/message.js";
import { main } from "./aichat.js";
export const aiChat = async (req, res) => {
  try {
    // req.body
    // name,id,msg aayega body mai
    const { id, name, msg } = req.body;

    //! Find the user and their previous messages
    let user = await User.findById(id).populate({
      path: "chatHistory",
      options: { sort: { timestamp: 1 } },
    });
    console.log(user)
    //! If user doesn't exist, create one
    if (!user) {
      user = await User.create({ _id: id, name: name });
    }

    // Create and save user message
    const userMessage = await Message.create({
      role: "user",
      content: msg,
    });

    user.chatHistory.push(userMessage);

    // structure format of message to gemini api

    const chatHistory = user.chatHistory.map((message) => {
      return {
        role: message.role,
        parts: [{ text: message.content }],
      };
    });

    // call gemin api
    const modelReply = await main(chatHistory);

    const modelMessage = await Message.create({
      role: "model",
      content: modelReply,
    });

    user.chatHistory.push(modelMessage);

    //  Save updated user document
    await user.save();

    res.json({ reply: modelReply,user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
