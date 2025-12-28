const mongoose = require('mongoose');

const writingEvaluationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  taskType: {
    type: Number,
    enum: [1, 2],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  scores: {
    taskAchievement: Number,
    coherence: Number,
    lexicalResource: Number,
    grammar: Number,
    overall: Number,
  },
  feedback: {
    corrections: [{
      original: String,
      corrected: String,
      explanation: String,
    }],
    improvedVersion: String,
    strengths: [String],
    improvements: [String],
  },
  language: {
    type: String,
    enum: ['en', 'bn'],
    default: 'en',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('WritingEvaluation', writingEvaluationSchema);
