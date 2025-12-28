const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: String,
  title: String,
  module: {
    type: String,
    enum: ['speaking', 'writing', 'reading', 'listening', 'vocabulary', 'grammar'],
  },
  duration: Number, // in minutes
  type: String, // 'practice', 'review', 'mock_test', 'learn'
  description: String,
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: Date,
});

const dailyPlanSchema = new mongoose.Schema({
  date: Date,
  tasks: [taskSchema],
  totalMinutes: Number,
  completed: {
    type: Boolean,
    default: false,
  },
});

const studyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetBand: {
    type: Number,
    required: true,
  },
  testDate: Date,
  studyHoursPerDay: {
    type: Number,
    default: 2,
  },
  focusAreas: [{
    module: String,
    priority: Number, // 1-5, higher = more priority
    reason: String,
  }],
  weeklyPlan: [dailyPlanSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
