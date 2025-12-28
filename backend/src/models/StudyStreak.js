const mongoose = require('mongoose');

const studyStreakSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  lastStudyDate: {
    type: Date,
  },
  totalStudyDays: {
    type: Number,
    default: 0,
  },
  studyDates: [{
    type: Date,
  }],
});

module.exports = mongoose.model('StudyStreak', studyStreakSchema);
