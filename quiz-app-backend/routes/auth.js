const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authMiddleware, isAdmin, isTeacher } = require("../middleware/auth");

const router = express.Router();

// Allowed roles for user creation
const ALLOWED_ROLES = ["student", "teacher"];

// Register a new user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate role
        if (!["student", "teacher"].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Allowed roles are 'student' and 'teacher'." });
        }

        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        // Create a JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        res.status(201).json({
            message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
            token,
        });
    } catch (error) {
        console.error("Registration Error:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// User login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create a JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
            token,
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Protected route to get user info
router.get("/user", authMiddleware, async (req, res) => {
    try {
        res.status(200).json({
            message: "Protected Route Accessed",
            user: req.user,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;
