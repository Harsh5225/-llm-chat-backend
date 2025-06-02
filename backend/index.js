import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { aiChat, getChatHistory, clearChatHistory } from "./chatController.js";
import { register, login, getUserProfile } from "./authController.js";
import { protect } from "./middleware/authMiddleware.js";
import connectDB from "./database/db.js";

const app = express();
dotenv.config();

// Enable CORS
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? process.env.CLIENT_URL 
    : "http://localhost:5173",
  methods: ["GET", "POST", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// Auth routes
app.post("/api/users/register", register);
app.post("/api/users/login", login);
app.get("/api/users/profile", protect, getUserProfile);

// Chat routes
app.post("/api/chat", protect, aiChat);
app.get("/api/chat/history", protect, getChatHistory);
app.delete("/api/chat/history", protect, clearChatHistory);

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
