const mongoose = require('mongoose');

const mockTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  titleBn: String,
  description: String,
  descriptionBn: String,
  type: {
    type: String,
    enum: ['speaking', 'writing', 'reading', 'listening', 'full'],
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  questions: [{
    questionText: String,
    questionTextBn: String,
    questionType: {
      type: String,
      enum: ['mcq', 'true-false', 'fill-blank', 'short-answer'],
    },
    options: [String],
    correctAnswer: String,
    passage: String,
    audioUrl: String,
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  bandRange: String, // e.g. "5.5-6.5"
}, {
  timestamps: true,
});

const mockTestResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MockTest',
    required: true,
  },
  answers: [{
    questionId: String,
    userAnswer: String,
    isCorrect: Boolean,
  }],
  score: Number,
  bandScore: Number,
  timeTaken: Number, // in minutes
  completedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const MockTest = mongoose.model('MockTest', mockTestSchema);
const MockTestResult = mongoose.model('MockTestResult', mockTestResultSchema);

module.exports = { MockTest, MockTestResult };
