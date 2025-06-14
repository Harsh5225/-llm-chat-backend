import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database/db.js";
import { aiChat, getChatHistory, clearChatHistory } from "./chatController.js";
import { register, login, getUserProfile } from "./authController.js";
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8000",
  "http://localhost:3000",
  "http://localhost:5000",
  process.env.CLIENT_URL, // Add production frontend URL
];

// Add this middleware before your routes to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Cookies:", req.cookies);
  next();
});

app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        console.log('CORS blocked for origin:', origin);
        callback(null, true); // Temporarily allow all origins
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

connectDB();
app.post("/api/users/register", register);
app.post("/api/users/login", login);
app.get("/api/users/profile", protect, getUserProfile);

app.post("/api/chat", protect, aiChat);
app.get("/api/chat/history", protect, getChatHistory);
app.delete("/api/chat/history", protect, clearChatHistory);

app.get("/test", (req, res) => {
  res.json({
    message: "Backend is working!",
    environment: process.env.NODE_ENV || "development",
  });
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack || err.message);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});
