const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
            selectedOption: { type: String, required: true },
            isCorrect: { type: Boolean, required: true }
        }
    ],
    score: { type: Number, required: true },
    attemptedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
