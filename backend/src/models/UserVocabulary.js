const mongoose = require('mongoose');

const userVocabularySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  wordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VocabularyWord',
    required: true,
  },
  status: {
    type: String,
    enum: ['learning', 'reviewing', 'mastered'],
    default: 'learning',
  },
  correctCount: {
    type: Number,
    default: 0,
  },
  incorrectCount: {
    type: Number,
    default: 0,
  },
  lastReviewed: Date,
  nextReview: Date,
  repetitionLevel: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure one entry per user per word
userVocabularySchema.index({ userId: 1, wordId: 1 }, { unique: true });

module.exports = mongoose.model('UserVocabulary', userVocabularySchema);
