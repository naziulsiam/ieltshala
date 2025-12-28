const mongoose = require('mongoose');

const speakingTopicSchema = new mongoose.Schema({
  part: {
    type: Number,
    enum: [1, 2, 3],
    required: true,
  },
  question: String, // For Part 1 & 3
  topic: String, // For Part 2
  topicBangla: String,
  bulletPoints: [String], // For Part 2
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  category: {
    type: String,
    enum: ['work', 'study', 'family', 'hobbies', 'travel', 'technology', 'environment', 'health', 'general'],
    default: 'general',
  },
  sampleAnswer: String,
  tips: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SpeakingTopic', speakingTopicSchema);
