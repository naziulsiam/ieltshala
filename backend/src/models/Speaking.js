const mongoose = require('mongoose');

const speakingTopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  titleBn: {
    type: String,
    required: true,
  },
  description: String,
  descriptionBn: String,
  part: {
    type: Number,
    enum: [1, 2, 3],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  sampleQuestions: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const speakingEvaluationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SpeakingTopic',
    required: true,
  },
  audioUrl: String,
  transcript: String,
  scores: {
    fluency: Number,
    pronunciation: Number,
    grammar: Number,
    coherence: Number,
    overall: Number,
  },
  feedback: {
    strengths: [String],
    improvements: [String],
    sampleAnswer: String,
    sampleAnswerBn: String,
  },
  language: {
    type: String,
    enum: ['en', 'bn'],
    default: 'en',
  },
}, {
  timestamps: true,
});

const SpeakingTopic = mongoose.model('SpeakingTopic', speakingTopicSchema);
const SpeakingEvaluation = mongoose.model('SpeakingEvaluation', speakingEvaluationSchema);

module.exports = { SpeakingTopic, SpeakingEvaluation };
