require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth"); // Import auth routes
const quizRoutes = require("./routes/quizRoutes"); // Import quiz routes
const quizAttemptRoutes = require("./routes/quizAttemptRoutes"); // Import quiz attempt routes
const leaderboardRoutes = require("./routes/leaderboard"); // Import leaderboard routes
const userRoutes = require("./routes/userRoutes"); // Import user routes
const User = require("./models/User"); // Import the User model (ensure you have this file)

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes); // Use quiz routes
app.use("/api/quiz-attempts", quizAttemptRoutes); // Use quiz attempt routes
app.use("/api/leaderboard", leaderboardRoutes); // Use leaderboard routes
app.use("/api/users", userRoutes); // Use user routes

// Register Route (API Endpoint for registering students)
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation: Ensure all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists (basic validation)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
     
    // Create a new user (Use bcrypt for hashing the password before saving)
    const newUser = new User({ name, email, password }); // You should hash the password using bcrypt
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// Register Route for Teachers (Similar to student registration, you can use different fields for teacher)
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, institution } = req.body;

    if (!name || !email || !password || !institution) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if teacher already exists
    const existingTeacher = await User.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already exists with this email" });
    }

    // Create and save new teacher
    const newTeacher = new User({ name, email, password, institution, role: "teacher" }); // Assign the role of teacher
    await newTeacher.save();

    return res.status(201).json({ message: "Teacher registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// Default Route
app.get("/", (req, res) => {
  res.send("Quiz App Backend Running!");
});

// Error-handling middleware (Handles internal server errors)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Stop the app if MongoDB connection fails
  }
};

// Start the server only after MongoDB is connected
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

// Global error handling for unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err.message);
  process.exit(1);
});

startServer();
