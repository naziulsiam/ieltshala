const { Vocabulary, UserVocabularyProgress } = require('../models/Vocabulary');

// Get daily vocabulary words
exports.getDailyWords = async (req, res) => {
  try {
    const { limit = 10, difficulty, language = 'en' } = req.query;
    const filter = {};
    
    if (difficulty) filter.difficulty = difficulty;

    const words = await Vocabulary.find(filter)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: words,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch words',
      error: error.message,
    });
  }
};

// Get flashcards for practice
exports.getFlashcards = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    // Get user's progress
    const progress = await UserVocabularyProgress.find({ userId: req.user.id })
      .populate('wordId');

    // Get words user hasn't seen yet
    const seenWordIds = progress.map(p => p.wordId._id);
    const newWords = await Vocabulary.find({ _id: { $nin: seenWordIds } })
      .limit(parseInt(limit));

    // Get words that need review
    const reviewWords = progress
      .filter(p => p.nextReview && p.nextReview < new Date())
      .map(p => p.wordId)
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        newWords,
        reviewWords,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch flashcards',
      error: error.message,
    });
  }
};

// Update word progress
exports.updateProgress = async (req, res) => {
  try {
    const { wordId, correct } = req.body;

    let progress = await UserVocabularyProgress.findOne({
      userId: req.user.id,
      wordId,
    });

    if (!progress) {
      progress = new UserVocabularyProgress({
        userId: req.user.id,
        wordId,
      });
    }

    if (correct) {
      progress.correctCount += 1;
      if (progress.correctCount >= 5) {
        progress.status = 'mastered';
      } else if (progress.correctCount >= 2) {
        progress.status = 'learning';
      }
    } else {
      progress.incorrectCount += 1;
    }

    // Calculate next review date (spaced repetition)
    const intervalDays = correct ? Math.pow(2, progress.correctCount) : 1;
    progress.nextReview = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000);
    progress.lastReviewed = new Date();

    await progress.save();

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update progress',
      error: error.message,
    });
  }
};

// Get user stats
exports.getStats = async (req, res) => {
  try {
    const progress = await UserVocabularyProgress.find({ userId: req.user.id });

    const stats = {
      totalWords: progress.length,
      mastered: progress.filter(p => p.status === 'mastered').length,
      learning: progress.filter(p => p.status === 'learning').length,
      new: progress.filter(p => p.status === 'new').length,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get stats',
      error: error.message,
    });
  }
};
