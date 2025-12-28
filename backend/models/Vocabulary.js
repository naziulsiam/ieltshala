const mongoose = require('mongoose');

const vocabularyWordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true,
  },
  definition: {
    type: String,
    required: true,
  },
  definitionBangla: {
    type: String,
    default: '',
  },
  partOfSpeech: {
    type: String,
    enum: ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'interjection'],
  },
  pronunciation: String,
  audioUrl: String, // For custom audio files
  example: String,
  exampleBangla: String,
  synonyms: [String],
  antonyms: [String],
  category: {
    type: String,
    enum: ['academic', 'general', 'business', 'technology', 'environment', 'education', 'health', 'travel'],
    default: 'general',
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate',
  },
  bandLevel: {
    type: Number,
    min: 5,
    max: 9,
    default: 7,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('VocabularyWord', vocabularyWordSchema);
