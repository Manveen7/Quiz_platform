const express = require("express");
// const { isAdmin, isTeacher } = require("../middleware/auth");
const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const User = require("../models/User");
const { authMiddleware, isAdmin, isTeacher } = require("../middleware/auth");
const {  authenticateTeacherOrAdmin } = require('../middleware/auth');

const router = express.Router();
// console.log("authMiddleware:", authMiddleware);

// Function to check and assign badges
const assignBadges = async (user) => {
    let badges = new Set(user.badges.map((badge) => badge.name));

    if (user.scores.length === 1) {
        badges.add("Beginner");
    }

    const highScores = user.scores.filter(
        (s) => (s.score / s.totalQuestions) * 100 >= 80
    );
    if (highScores.length >= 5) {
        badges.add("Quiz Master");
    }

    const perfectScore = user.scores.some(
        (s) => s.score === s.totalQuestions
    );
    if (perfectScore) {
        badges.add("Champion");
    }

    user.badges = Array.from(badges).map((badgeName) => ({
        name: badgeName,
        description: `${badgeName} badge earned!`,
        dateEarned: new Date(),
    }));
    await user.save();
};

// ✅ Only Admins Can Create Quizzes
router.post("/create", authMiddleware, authenticateTeacherOrAdmin, async (req, res) => {
    try {
        const { title, description, questions } = req.body;

        // Validate input
        if (!title || !description || !questions || questions.length === 0) {
            return res.status(400).json({ message: "Title, description, and questions are required" });
        }

        // Validate each question
        for (let question of questions) {
            if (
                !question.questionText ||
                !question.options ||
                question.options.length < 2 ||
                !question.correctAnswer
            ) {
                return res.status(400).json({
                    message: "Each question must have a question text, at least two options, and a correct answer",
                });
            }

            // Ensure correctAnswer is one of the options
            if (!question.options.includes(question.correctAnswer)) {
                return res.status(400).json({
                    message: `Correct answer '${question.correctAnswer}' is not in options for question: '${question.questionText}'`,
                });
            }
        }

        // Save the quiz to the database
        const quiz = new Quiz({
            title,
            description,
            questions,
            createdBy: req.user.id,
        });

        await quiz.save();
        res.status(201).json({ message: "Quiz created successfully", quiz });
    } catch (error) {
        console.error("Error creating quiz:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});


// ✅ Only Teachers Can View Their Own Quizzes
router.get("/my-quizzes", authMiddleware, isTeacher, async (req, res) => {
    try {
        const quizzes = await Quiz.find({ createdBy: req.user.id });

        if (!quizzes || quizzes.length === 0) {
            return res.status(404).json({ message: "No quizzes found" });
        }

        res.status(200).json({
            message: "Quizzes fetched successfully",
            quizzes,
        });
    } catch (error) {
        console.error("Error fetching quizzes:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});
// @route   GET /api/quizzes/:id
// @desc    Get a quiz by ID
// @access  Public
router.get("/:id", async (req, res) => {
    try {
        console.log("Quiz ID received:", req.params.id);

        const quiz = await Quiz.findById(req.params.id).populate("createdBy", "name email");

        if (!quiz) {
            console.log("Quiz not found for ID:", req.params.id);
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.status(200).json(quiz);
    } catch (error) {
        console.error("Error fetching quiz:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Students Can Only View & Attempt Quizzes
router.get("/", authMiddleware, async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate("createdBy", "name email");

        if (!quizzes || quizzes.length === 0) {
            return res.status(404).json({ message: "No quizzes available" });
        }

        res.status(200).json({
            message: "Quizzes fetched successfully",
            quizzes,
        });
    } catch (error) {
        console.error("Error fetching quizzes:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// @route   GET /api/quizzes/leaderboard
// @desc    Get leaderboard (Top quiz attempts by score)
// @access  Public
router.get("/leaderboard", async (req, res) => {
    try {
        const leaderboard = await QuizAttempt.find()
            .populate("user", "name email")
            .populate("quiz", "title")
            .sort({ score: -1, date: -1 })
            .limit(10);

        if (!leaderboard || leaderboard.length === 0) {
            return res.status(404).json({ message: "No leaderboard data available" });
        }

        const formattedLeaderboard = leaderboard.map((entry) => ({
            userName: entry.user?.name || "Unknown User",
            userEmail: entry.user?.email || "Unknown Email",
            quizTitle: entry.quiz?.title || "Unknown Quiz",
            score: entry.score,
            totalQuestions: entry.totalQuestions,
            percentage: ((entry.score / entry.totalQuestions) * 100).toFixed(2),
            date: entry.date,
        }));

        res.status(200).json({
            message: "Leaderboard fetched successfully",
            leaderboard: formattedLeaderboard,
        });
    } catch (error) {
        console.error("Error fetching leaderboard:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// // @route   GET /api/quizzes/:id
// // @desc    Get a quiz by ID
// // @access  Public
// router.get("/:id", async (req, res) => {
//     try {
//         console.log("Quiz ID received:", req.params.id);

//         const quiz = await Quiz.findById(req.params.id).populate("createdBy", "name email");

//         if (!quiz) {
//             console.log("Quiz not found for ID:", req.params.id);
//             return res.status(404).json({ message: "Quiz not found" });
//         }

//         res.status(200).json(quiz);
//     } catch (error) {
//         console.error("Error fetching quiz:", error);
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// });

// @route   POST /api/quizzes/:id/attempt
// @desc    Attempt a quiz, calculate score, and assign badges
// @access  Private (User must be logged in)
router.post("/:id/attempt", authMiddleware, async (req, res) => {
    try {
        const quizId = req.params.id;
        const { answers } = req.body;
        const userId = req.user.id;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        let score = 0;

        quiz.questions.forEach((question) => {
            const userAnswer = answers[question._id]?.trim();
            const correctAnswer = question.correctAnswer.trim();

            if (userAnswer === correctAnswer) {
                score++;
            }
        });

        const totalQuestions = quiz.questions.length;
        const percentage = (score / totalQuestions) * 100;

        const attempt = new QuizAttempt({
            user: userId,
            quiz: quizId,
            score,
            totalQuestions,
            date: new Date(),
        });

        await attempt.save();

        res.status(200).json({
            message: "Quiz attempted successfully",
            score,
            totalQuestions,
            percentage,
        });
    } catch (error) {
        console.error("Error attempting quiz:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// @route   POST /api/quizzes/:id/submit
// @desc    Submit answers, calculate score, and assign badges
// @access  Private (Only logged-in users can submit quizzes)
router.post("/quizzes/:id/submit", authMiddleware, async (req, res) => {
    try {
        const { answers } = req.body;
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        let score = 0;
        quiz.questions.forEach((question) => {
            if (answers[question._id] === question.correctAnswer) {
                score++;
            }
        });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.scores.push({
            quizId: quiz._id,
            score,
            totalQuestions: quiz.questions.length,
            date: new Date(),
        });

        await assignBadges(user);

        res.status(200).json({
            message: "Quiz submitted successfully",
            score,
            totalQuestions: quiz.questions.length,
            badges: user.badges,
        });
    } catch (error) {
        console.error("Error submitting quiz:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   GET /api/quizzes/profile
// @desc    Get user profile (name, email, badges, and scores)
// router.get("/profile", authMiddleware, async (req, res) => {
//     try {
//         const user = await User.findById(req.user.id).select("name email badges scores");
//         if (!user) return res.status(404).json({ message: "User not found" });

//         const profile = {
//             name: user.name,
//             email: user.email,
//             badges: user.badges,
//             scores: user.scores.map(score => ({
//                 quizId: score.quizId,
//                 score: score.score,
//                 totalQuestions: score.totalQuestions,
//                 date: score.date,
//             })),
//         };

//         res.status(200).json({
//             message: "User profile fetched successfully",
//             profile,
//         });
//     } catch (error) {
//         console.error("Error fetching user profile:", error.message);
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// });

// @route   GET /api/quizzes/user/history
// @desc    Get the quiz attempt history of the authenticated user
// @access  Private (User must be logged in)
router.get("/user/history", authMiddleware, async (req, res) => {
    try {
        const attempts = await QuizAttempt.find({ user: req.user.id })
            .populate("quiz", "title")
            .sort({ date: -1 });

        if (!attempts || attempts.length === 0) {
            return res.status(404).json({ message: "No quiz attempts found" });
        }

        const formattedAttempts = attempts.map(attempt => ({
            quizTitle: attempt.quiz?.title || "Unknown Quiz",
            score: attempt.score,
            totalQuestions: attempt.totalQuestions,
            percentage: ((attempt.score / attempt.totalQuestions) * 100).toFixed(2),
            date: attempt.date,
        }));

        res.status(200).json({
            message: "Quiz attempt history fetched successfully",
            history: formattedAttempts,
        });
    } catch (error) {
        console.error("Error fetching quiz attempt history:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// @route   PUT /api/quizzes/:id
// @desc    Update a quiz by ID
// @access  Private (Only admins can edit quizzes)
router.put('/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { title, description, questions } = req.body;

        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if (questions) {
            const invalidQuestions = questions.some(
                (q) => !q.question || !q.options || q.options.length < 2 || !q.correctAnswer
            );
            if (invalidQuestions) {
                return res.status(400).json({
                    message: "Each question must have a question text, at least two options, and a correct answer",
                });
            }
        }

        quiz.title = title || quiz.title;
        quiz.description = description || quiz.description;
        quiz.questions = questions || quiz.questions;

        await quiz.save();

        res.status(200).json({
            message: "Quiz updated successfully",
            quiz,
        });
    } catch (error) {
        console.error("Error updating quiz:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Only Admins Can Delete Quizzes
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        await quiz.deleteOne();
        res.status(200).json({
            message: "Quiz deleted successfully",
            quizId: quiz._id,
        });
    } catch (error) {
        console.error("Error deleting quiz:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;