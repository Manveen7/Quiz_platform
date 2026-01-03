// userRoutes.js

const express = require('express');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/profile - Get profile of the authenticated user
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // Fetch user data using the ID from the JWT token
    const user = await User.findById(req.user.id).select('name email role badges scores');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the profile data directly (not nested)
    res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role, // Add role if missing
      badges: user.badges || [],
      scores: user.scores?.map(score => ({
        quizId: score.quizId,
        score: score.score,
        totalQuestions: score.totalQuestions,
        date: score.date,
      })) || [],
    });
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
