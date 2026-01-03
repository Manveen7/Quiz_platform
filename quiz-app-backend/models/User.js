const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Password for authentication
    role: { type: String, enum: ["student", "teacher", "admin"], required: true }, // Role for user type
    scores: [
        {
            quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
            score: { type: Number, required: true },
            totalQuestions: { type: Number, required: true },
            date: { type: Date, default: Date.now },
        },
    ],
    badges: [
        {
            name: { type: String, required: true }, // Badge name
            description: { type: String, required: true }, // Badge description
            dateEarned: { type: Date, default: Date.now }, // Date when the badge was earned
        },
    ],
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

module.exports = mongoose.model("User", UserSchema);
