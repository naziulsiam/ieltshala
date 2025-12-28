const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number, // Index of correct option
  questionType: {
    type: String,
    enum: ['multiple_choice', 'true_false', 'matching', 'fill_in_blank'],
    default: 'multiple_choice',
  },
});

const readingPassageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  titleBangla: String,
  passage: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  category: {
    type: String,
    enum: ['science', 'history', 'culture', 'technology', 'environment', 'education', 'health', 'general'],
    default: 'general',
  },
  wordCount: Number,
  questions: [questionSchema],
  timeLimit: {
    type: Number,
    default: 20, // minutes
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ReadingPassage', readingPassageSchema);
