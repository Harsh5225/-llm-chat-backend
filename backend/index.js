import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { aiChat, getChatHistory, clearChatHistory } from "./chatController.js";
import { register, login, getUserProfile } from "./authController.js";
import { protect } from "./middleware/authMiddleware.js";
import connectDB from "./database/db.js";

const app = express();
dotenv.config();

// Production-ready CORS configuration
const corsOptions = {
  // In production, allow specific domains + fallback to allow request origin
  origin: function(origin, callback) {
    // List of allowed domains (add your frontend domains here)
    const whitelist = [
      'https://llm-chat-backend-five.vercel.app', // Your Vercel frontend URL
      'http://localhost:5173', // Local development
      // Add any other domains you want to explicitly allow
    ];
    
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in whitelist
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // For other origins, allow them in production for now
      // You can make this more restrictive later
      console.log('Request from origin:', origin);
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

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
  res.json({ 
    message: "Backend is working!", 
    environment: process.env.NODE_ENV || 'development'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
