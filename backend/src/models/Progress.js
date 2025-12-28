const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  module: {
    type: String,
    enum: ['speaking', 'writing', 'reading', 'listening'],
    required: true,
  },
  activityType: {
    type: String,
    enum: ['practice', 'mock_test', 'vocabulary', 'lesson'],
    required: true,
  },
  score: {
    type: Number,
    min: 0,
    max: 9,
  },
  details: {
    taskType: String, // For writing: 'task1' or 'task2'
    part: Number, // For speaking: 1, 2, or 3
    questionsCorrect: Number,
    questionsTotal: Number,
    timeSpent: Number, // in seconds
    bandScores: {
      overall: Number,
      criterion1: Number,
      criterion2: Number,
      criterion3: Number,
      criterion4: Number,
    },
  },
  feedback: String,
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
progressSchema.index({ userId: 1, completedAt: -1 });
progressSchema.index({ userId: 1, module: 1 });

module.exports = mongoose.model('Progress', progressSchema);
