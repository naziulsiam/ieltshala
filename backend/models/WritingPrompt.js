const mongoose = require('mongoose');

const writingPromptSchema = new mongoose.Schema({
  task: {
    type: Number,
    enum: [1, 2],
    required: true,
  },
  type: {
    type: String,
    required: true, // e.g., "Line Graph", "Opinion", "Discussion"
  },
  prompt: {
    type: String,
    required: true,
  },
  promptBangla: String,
  imageUrl: String,
  wordCount: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  bandLevel: {
    type: Number,
    min: 5,
    max: 9,
    default: 7,
  },
  tips: [String],
  sampleAnswer: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('WritingPrompt', writingPromptSchema);
