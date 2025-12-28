const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
});

const listeningExerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  titleBangla: String,
  section: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true,
  },
  transcript: {
    type: String,
    required: true,
  },
  audioUrl: String,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  questions: [questionSchema],
  duration: Number, // in seconds
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ListeningExercise', listeningExerciseSchema);
