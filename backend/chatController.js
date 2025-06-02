import { User } from "./models/user.js";
import { Message } from "./models/message.js";
import { main } from "./aichat.js";

export const aiChat = async (req, res) => {
  try {
    console.log("Request received:", req.body);
    const { msg } = req.body;

    if (!msg) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Get user from auth middleware
    const user = await User.findById(req.user.id).populate({
      path: "chatHistory",
      options: { sort: { timestamp: 1 } },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create and save user message
    const userMessage = await Message.create({
      role: "user",
      content: msg,
    });

    user.chatHistory.push(userMessage);

    // Prepare the conversation history structure for the AI model
    const chatHistory = user.chatHistory.map((message) => {
      return {
        role: message.role,
        parts: [{ text: message.content }],
      };
    });

    console.log("Sending to AI model...");
    // Call the AI model
    const modelReply = await main(chatHistory);
    console.log("AI response received");

    const modelMessage = await Message.create({
      role: "model",
      content: modelReply,
    });

    user.chatHistory.push(modelMessage);

    // Save updated user document
    await user.save();
    console.log("User saved with updated chat history");

    res.json({ reply: modelReply, user });
  } catch (error) {
    console.error("Error in aiChat:", error);
    res.status(500).json({ 
      error: "Server Error", 
      message: error.message
    });
  }
};

// Get chat history
export const getChatHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "chatHistory",
      options: { sort: { timestamp: 1 } },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ chatHistory: user.chatHistory });
  } catch (error) {
    console.error("Error getting chat history:", error);
    res.status(500).json({ 
      error: "Server Error", 
      message: error.message 
    });
  }
};

// Clear chat history
export const clearChatHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get the message IDs to delete
    const messageIds = user.chatHistory;
    
    // Clear the user's chat history array
    user.chatHistory = [];
    await user.save();
    
    // Delete all the messages from the Messages collection
    if (messageIds.length > 0) {
      await Message.deleteMany({ _id: { $in: messageIds } });
    }

    res.json({ message: "Chat history cleared successfully" });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    res.status(500).json({ 
      error: "Server Error", 
      message: error.message 
    });
  }
};
