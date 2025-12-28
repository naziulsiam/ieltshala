const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const VocabularyWord = require('../models/Vocabulary');
const UserVocabulary = require('../models/UserVocabulary');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};

// Seed initial vocabulary (run once)
router.post('/seed', async (req, res) => {
  try {
    const count = await VocabularyWord.countDocuments();
    
    if (count > 0) {
      return res.json({ message: 'Vocabulary already seeded', count });
    }

    const words = [
      {
        word: 'adequate',
        definition: 'Sufficient for a specific need or requirement',
        partOfSpeech: 'adjective',
        pronunciation: '/ˈæd.ɪ.kwət/',
        example: 'The salary was adequate for basic living expenses.',
        synonyms: ['sufficient', 'enough', 'satisfactory'],
        antonyms: ['inadequate', 'insufficient'],
        category: 'academic',
        difficulty: 'intermediate',
        bandLevel: 6,
      },
      {
        word: 'analyze',
        definition: 'To examine something in detail to understand it better',
        partOfSpeech: 'verb',
        pronunciation: '/ˈæn.əl.aɪz/',
        example: 'Scientists analyze data to draw conclusions.',
        synonyms: ['examine', 'study', 'investigate'],
        antonyms: ['ignore', 'overlook'],
        category: 'academic',
        difficulty: 'intermediate',
        bandLevel: 7,
      },
      {
        word: 'controversy',
        definition: 'A prolonged public disagreement or heated discussion',
        partOfSpeech: 'noun',
        pronunciation: '/ˈkɒn.trə.vɜː.si/',
        example: 'The new policy sparked a lot of controversy.',
        synonyms: ['debate', 'dispute', 'argument'],
        antonyms: ['agreement', 'harmony'],
        category: 'academic',
        difficulty: 'advanced',
        bandLevel: 7,
      },
      {
        word: 'demonstrate',
        definition: 'To show clearly by giving proof or evidence',
        partOfSpeech: 'verb',
        pronunciation: '/ˈdem.ən.streɪt/',
        example: 'The experiment demonstrated the theory was correct.',
        synonyms: ['show', 'prove', 'illustrate'],
        antonyms: ['conceal', 'hide'],
        category: 'academic',
        difficulty: 'intermediate',
        bandLevel: 6,
      },
      {
        word: 'efficient',
        definition: 'Working in a well-organized way without wasting time or energy',
        partOfSpeech: 'adjective',
        pronunciation: '/ɪˈfɪʃ.ənt/',
        example: 'The new system is more efficient than the old one.',
        synonyms: ['effective', 'productive', 'competent'],
        antonyms: ['inefficient', 'wasteful'],
        category: 'general',
        difficulty: 'intermediate',
        bandLevel: 6,
      },
      {
        word: 'emphasize',
        definition: 'To give special importance or attention to something',
        partOfSpeech: 'verb',
        pronunciation: '/ˈem.fə.saɪz/',
        example: 'The teacher emphasized the importance of practice.',
        synonyms: ['stress', 'highlight', 'underline'],
        antonyms: ['minimize', 'understate'],
        category: 'academic',
        difficulty: 'intermediate',
        bandLevel: 6,
      },
      {
        word: 'implement',
        definition: 'To put a plan or system into operation',
        partOfSpeech: 'verb',
        pronunciation: '/ˈɪm.plɪ.ment/',
        example: 'The company will implement new policies next month.',
        synonyms: ['execute', 'carry out', 'apply'],
        antonyms: ['abandon', 'cancel'],
        category: 'business',
        difficulty: 'advanced',
        bandLevel: 7,
      },
      {
        word: 'inevitable',
        definition: 'Certain to happen and unable to be avoided',
        partOfSpeech: 'adjective',
        pronunciation: '/ɪˈnev.ɪ.tə.bəl/',
        example: 'Change is inevitable in any organization.',
        synonyms: ['unavoidable', 'certain', 'inescapable'],
        antonyms: ['avoidable', 'uncertain'],
        category: 'general',
        difficulty: 'advanced',
        bandLevel: 7,
      },
      {
        word: 'perspective',
        definition: 'A particular way of viewing things that depends on one experience',
        partOfSpeech: 'noun',
        pronunciation: '/pəˈspek.tɪv/',
        example: 'From his perspective, the decision was correct.',
        synonyms: ['viewpoint', 'outlook', 'standpoint'],
        antonyms: [],
        category: 'academic',
        difficulty: 'advanced',
        bandLevel: 7,
      },
      {
        word: 'significant',
        definition: 'Important, large, or noticeable enough to have an effect',
        partOfSpeech: 'adjective',
        pronunciation: '/sɪɡˈnɪf.ɪ.kənt/',
        example: 'There has been a significant improvement in results.',
        synonyms: ['important', 'considerable', 'substantial'],
        antonyms: ['insignificant', 'trivial'],
        category: 'academic',
        difficulty: 'intermediate',
        bandLevel: 6,
      },
      {
        word: 'sustainable',
        definition: 'Able to continue over a period of time without harming the environment',
        partOfSpeech: 'adjective',
        pronunciation: '/səˈsteɪ.nə.bəl/',
        example: 'We need to find sustainable energy sources.',
        synonyms: ['maintainable', 'viable', 'renewable'],
        antonyms: ['unsustainable', 'harmful'],
        category: 'environment',
        difficulty: 'advanced',
        bandLevel: 7,
      },
      {
        word: 'comprehensive',
        definition: 'Including everything or nearly everything',
        partOfSpeech: 'adjective',
        pronunciation: '/ˌkɒm.prɪˈhen.sɪv/',
        example: 'The report provides a comprehensive overview.',
        synonyms: ['complete', 'thorough', 'extensive'],
        antonyms: ['incomplete', 'partial'],
        category: 'academic',
        difficulty: 'advanced',
        bandLevel: 7,
      },
      {
        word: 'facilitate',
        definition: 'To make an action or process easier',
        partOfSpeech: 'verb',
        pronunciation: '/fəˈsɪl.ɪ.teɪt/',
        example: 'Technology can facilitate learning.',
        synonyms: ['enable', 'assist', 'help'],
        antonyms: ['hinder', 'obstruct'],
        category: 'business',
        difficulty: 'advanced',
        bandLevel: 7,
      },
      {
        word: 'innovation',
        definition: 'A new idea, method, or invention',
        partOfSpeech: 'noun',
        pronunciation: '/ˌɪn.əˈveɪ.ʃən/',
        example: 'Innovation drives economic growth.',
        synonyms: ['invention', 'creativity', 'novelty'],
        antonyms: ['tradition', 'convention'],
        category: 'technology',
        difficulty: 'intermediate',
        bandLevel: 6,
      },
      {
        word: 'reluctant',
        definition: 'Unwilling and hesitant',
        partOfSpeech: 'adjective',
        pronunciation: '/rɪˈlʌk.tənt/',
        example: 'She was reluctant to accept the job offer.',
        synonyms: ['unwilling', 'hesitant', 'disinclined'],
        antonyms: ['willing', 'eager'],
        category: 'general',
        difficulty: 'intermediate',
        bandLevel: 6,
      },
      {
        word: 'authentic',
        definition: 'Real, genuine, and not a copy',
        partOfSpeech: 'adjective',
        pronunciation: '/ɔːˈθen.tɪk/',
        example: 'The painting is authentic, not a forgery.',
        synonyms: ['genuine', 'real', 'legitimate'],
        antonyms: ['fake', 'false', 'counterfeit'],
        category: 'general',
        difficulty: 'intermediate',
        bandLevel: 6,
      },
      {
        word: 'collaborate',
        definition: 'To work together with others on a project',
        partOfSpeech: 'verb',
        pronunciation: '/kəˈlæb.ə.reɪt/',
        example: 'Scientists from different countries collaborate on research.',
        synonyms: ['cooperate', 'work together', 'team up'],
        antonyms: ['compete', 'oppose'],
        category: 'business',
        difficulty: 'intermediate',
        bandLevel: 6,
      },
      {
        word: 'diverse',
        definition: 'Showing a great deal of variety',
        partOfSpeech: 'adjective',
        pronunciation: '/daɪˈvɜːs/',
        example: 'The city has a diverse population.',
        synonyms: ['varied', 'different', 'assorted'],
        antonyms: ['uniform', 'homogeneous'],
        category: 'general',
        difficulty: 'intermediate',
        bandLevel: 6,
      },
      {
        word: 'prevalent',
        definition: 'Widespread or common in a particular area or time',
        partOfSpeech: 'adjective',
        pronunciation: '/ˈprev.əl.ənt/',
        example: 'Smartphone use is prevalent among teenagers.',
        synonyms: ['widespread', 'common', 'pervasive'],
        antonyms: ['rare', 'uncommon'],
        category: 'academic',
        difficulty: 'advanced',
        bandLevel: 7,
      },
      {
        word: 'rigorous',
        definition: 'Extremely thorough and careful',
        partOfSpeech: 'adjective',
        pronunciation: '/ˈrɪɡ.ər.əs/',
        example: 'The study used rigorous scientific methods.',
        synonyms: ['thorough', 'strict', 'demanding'],
        antonyms: ['lax', 'careless'],
        category: 'academic',
        difficulty: 'advanced',
        bandLevel: 8,
      },
    ];

    await VocabularyWord.insertMany(words);

    res.json({ 
      success: true, 
      message: 'Vocabulary seeded successfully',
      count: words.length 
    });
  } catch (error) {
    console.error('Seed vocabulary error:', error);
    res.status(500).json({ error: 'Failed to seed vocabulary' });
  }
});

// Get vocabulary words for practice (with filters)
router.get('/words', authenticateToken, async (req, res) => {
  try {
    const { category, difficulty, limit = 10 } = req.query;
    const userId = req.user.userId || req.user.id || req.user._id;

    let filter = {};
    if (category && category !== 'all') filter.category = category;
    if (difficulty && difficulty !== 'all') filter.difficulty = difficulty;

    // Get words
    const words = await VocabularyWord.find(filter)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Get user's progress for these words
    const wordIds = words.map(w => w._id);
    const userProgress = await UserVocabulary.find({
      userId,
      wordId: { $in: wordIds },
    });

    // Combine data
    const wordsWithProgress = words.map(word => {
      const progress = userProgress.find(p => p.wordId.toString() === word._id.toString());
      return {
        ...word.toObject(),
        userProgress: progress || null,
      };
    });

    res.json({
      success: true,
      words: wordsWithProgress,
    });
  } catch (error) {
    console.error('Get vocabulary error:', error);
    res.status(500).json({ error: 'Failed to fetch vocabulary' });
  }
});

// Get user vocabulary statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;

    const stats = await UserVocabulary.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalWords = await UserVocabulary.countDocuments({ userId });
    const totalCorrect = await UserVocabulary.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$correctCount' } } },
    ]);

    res.json({
      success: true,
      stats: {
        total: totalWords,
        byStatus: stats,
        totalCorrect: totalCorrect[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error('Get vocabulary stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Review a word (update progress)
router.post('/review', authenticateToken, async (req, res) => {
  try {
    const { wordId, correct } = req.body;
    const userId = req.user.userId || req.user.id || req.user._id;

    let userVocab = await UserVocabulary.findOne({ userId, wordId });

    if (!userVocab) {
      userVocab = new UserVocabulary({
        userId,
        wordId,
        status: 'learning',
      });
    }

    // Update counts
    if (correct) {
      userVocab.correctCount += 1;
      userVocab.repetitionLevel += 1;
    } else {
      userVocab.incorrectCount += 1;
      userVocab.repetitionLevel = Math.max(0, userVocab.repetitionLevel - 1);
    }

    // Update status based on performance
    if (userVocab.repetitionLevel >= 5) {
      userVocab.status = 'mastered';
    } else if (userVocab.repetitionLevel >= 2) {
      userVocab.status = 'reviewing';
    } else {
      userVocab.status = 'learning';
    }

    // Calculate next review date (spaced repetition)
    const now = new Date();
    const intervals = [1, 3, 7, 14, 30]; // days
    const interval = intervals[Math.min(userVocab.repetitionLevel, intervals.length - 1)];
    userVocab.nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);
    userVocab.lastReviewed = now;

    await userVocab.save();

    res.json({
      success: true,
      message: 'Progress updated',
      userVocab,
    });
  } catch (error) {
    console.error('Review word error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

module.exports = router;
