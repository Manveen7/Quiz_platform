const mongoose = require('mongoose');

// Define the schema for a single question
const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true }, // Ensure question text is required
  options: {
    type: [String],
    validate: {
      validator: (options) => options.length >= 2, // Ensure at least two options
      message: 'A question must have at least two options.',
    },
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
    validate: {
      validator: function (answer) {
        return this.options.includes(answer); // Ensure correctAnswer is one of the options
      },
      message: 'The correct answer must be one of the options.',
    },
  },
});

// Define the schema for a quiz
const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Ensure title is required
    description: { type: String, required: true }, // Ensure description is required
    questions: {
      type: [questionSchema],
      validate: {
        validator: (questions) => questions.length > 0, // Ensure at least one question
        message: 'A quiz must have at least one question.',
      },
      required: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who created the quiz
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model('Quiz', quizSchema);
