const mongoose = require('mongoose');

const learnContentSchema = new mongoose.Schema({
  module: {
    type: String,
    enum: ['speaking', 'writing', 'reading', 'listening'],
    required: true,
  },
  category: {
    type: String,
    required: true, // e.g., "format", "strategy", "vocabulary", "grammar"
  },
  title: {
    type: String,
    required: true,
  },
  titleBn: String,
  description: String,
  descriptionBn: String,
  content: {
    type: String, // Rich text/HTML content
    required: true,
  },
  contentBn: String,
  order: {
    type: Number,
    default: 0,
  },
  duration: Number, // Estimated reading time in minutes
  resources: [{
    type: {
      type: String,
      enum: ['video', 'pdf', 'audio', 'link', 'image'],
    },
    url: String,
    title: String,
  }],
  examples: [{
    type: String,
  }],
  keyTakeaways: [String],
  relatedPracticeId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedPracticeModel',
  },
  relatedPracticeModel: {
    type: String,
    enum: ['SpeakingTopic', 'WritingTask', 'ReadingPassage', 'ListeningExercise'],
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('LearnContent', learnContentSchema);
