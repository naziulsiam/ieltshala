const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  activities: [{
    type: {
      type: String,
      enum: ['speaking', 'writing', 'reading', 'listening', 'vocabulary'],
    },
    score: Number,
    duration: Number, // in minutes
    completed: Boolean,
  }],
  dailyStreak: Number,
  totalMinutes: Number,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Progress', progressSchema);
