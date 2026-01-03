const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🔐 Middleware to verify and decode JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided. Authorization denied." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

// 🛡️ Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// 👩‍🏫 Middleware to check if the user is a teacher
const isTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied. Teachers only." });
  }
  next();
};

// 👩‍🏫 👨‍💼 Middleware for teacher or admin access
const authenticateTeacherOrAdmin = (req, res, next) => {
  const role = req.user.role;
  if (role !== "teacher" && role !== "admin") {
    return res.status(403).json({ message: "Access denied. Teachers or admins only." });
  }
  next();
};

module.exports = {
  authMiddleware,
  isAdmin,
  isTeacher,
  authenticateTeacherOrAdmin
};
