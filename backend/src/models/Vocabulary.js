const mongoose = require('mongoose');

const vocabularySchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true,
  },
  wordBn: String,
  definition: {
    type: String,
    required: true,
  },
  definitionBn: String,
  pronunciation: String,
  partOfSpeech: {
    type: String,
    enum: ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'other'],
  },
  examples: [String],
  examplesBn: [String],
  synonyms: [String],
  antonyms: [String],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate',
  },
  category: {
    type: String,
    enum: ['academic', 'general', 'topic-specific'],
    default: 'general',
  },
  bandLevel: {
    type: Number,
    min: 5,
    max: 9,
    default: 6,
  },
}, {
  timestamps: true,
});

const userVocabularyProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  wordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vocabulary',
    required: true,
  },
  status: {
    type: String,
    enum: ['new', 'learning', 'mastered'],
    default: 'new',
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
}, {
  timestamps: true,
});

const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);
const UserVocabularyProgress = mongoose.model('UserVocabularyProgress', userVocabularyProgressSchema);

module.exports = { Vocabulary, UserVocabularyProgress };
