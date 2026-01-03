const express = require("express");
const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const { authMiddleware, isAdmin, isTeacher } = require("../middleware/auth");


const router = express.Router();

// @route   POST /api/quizzes/:quizId/attempt
// @desc    Submit a quiz attempt
// @access  Private (Only logged-in users)
// router.post("/:quizId/attempt", authMiddleware, async (req, res) => {
//     try {
//         const { quizId } = req.params;
//         const { answers } = req.body;

//         // Validate input
//         if (!answers || answers.length === 0) {
//             return res.status(400).json({ message: "Answers are required" });
//         }

//         const quiz = await Quiz.findById(quizId);
//         if (!quiz) {
//             return res.status(404).json({ message: "Quiz not found" });
//         }

//         let score = 0;
//         const evaluatedAnswers = quiz.questions.map((question, index) => {
//             const userAnswer = answers.find(ans => ans.questionId.toString() === question._id.toString());

//             if (!userAnswer) return null;

//             const isCorrect = userAnswer.selectedOption === question.correctAnswer;
//             if (isCorrect) score += 1;

//             return {
//                 questionId: question._id,
//                 selectedOption: userAnswer.selectedOption,
//                 isCorrect
//             };
//         }).filter(ans => ans !== null);

//         const quizAttempt = new QuizAttempt({
//             quiz: quizId,
//             user: req.user.id,
//             answers: evaluatedAnswers,
//             score
//         });

//         await quizAttempt.save();

//         res.status(201).json({ message: "Quiz attempt submitted successfully", score });
//     } catch (error) {
//         console.error("Quiz Attempt Error:", error);
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// });

// @route   GET /api/quizzes/:quizId/attempts
// @desc    Get all attempts for a quiz
// @access  Private (Only logged-in users)
// router.get("/:quizId/attempts", authMiddleware, async (req, res) => {
//     try {
//         const { quizId } = req.params;
//         const attempts = await QuizAttempt.find({ quiz: quizId }).populate("user", "name email");

//         res.status(200).json(attempts);
//     } catch (error) {
//         console.error("Error fetching attempts:", error);
//         res.status(500).json({ message: "Server Error" });
//     }
// });

module.exports = router;
