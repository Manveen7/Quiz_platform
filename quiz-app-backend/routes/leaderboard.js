const express = require("express");
const User = require("../models/User");
const { verifyToken, authorizeRoles, authMiddleware, isTeacher } = require("../middleware/auth");

const router = express.Router();

/**
 * @route   GET /api/leaderboard
 * @desc    Get leaderboard (Top users by highest quiz score)
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .populate("scores.quizId", "title")
      .select("name email scores");

    const sortedUsers = users
      .map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        highestScore: user.scores.length > 0
          ? Math.max(...user.scores.map(score => score.score))
          : 0,
        scores: user.scores
      }))
      .sort((a, b) => b.highestScore - a.highestScore)
      .slice(0, 100);

    res.status(200).json(sortedUsers);
  } catch (error) {
    console.error("Error fetching leaderboard:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * @route   DELETE /api/leaderboard/remove-student/:id
 * @desc    Allow teacher to delete a student from the leaderboard
 * @access  Private (teacher only)
 */
router.delete("/remove-student/:id", authMiddleware, isTeacher, async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists and has the "student" role
    if (!user) {
      return res.status(404).json({ message: "Student not found." });
    }

    if (user.role !== "student") {
      return res.status(403).json({ message: "Only students can be removed from the leaderboard." });
    }

    // Clear the student's scores instead of deleting the user
    user.scores = [];
    await user.save();

    res.status(200).json({ message: "Student's scores removed successfully from the leaderboard." });
  } catch (error) {
    console.error("Error removing student:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
