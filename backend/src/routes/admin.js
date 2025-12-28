const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const VocabularyWord = require('../models/Vocabulary');
const WritingPrompt = require('../models/WritingPrompt');
const SpeakingTopic = require('../models/SpeakingTopic');
const ReadingPassage = require('../models/ReadingPassage');
const ListeningExercise = require('../models/ListeningExercise');
const User = require('../models/User');
const Progress = require('../models/Progress');
const jwt = require('jsonwebtoken');

// Middleware to verify admin (both admin and super_admin)
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    try {
      const userId = decoded.userId || decoded.id || decoded._id;
      const user = await User.findById(userId);

      if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      req.user = decoded;
      req.userRole = user.role;
      next();
    } catch (error) {
      return res.status(500).json({ error: 'Authentication failed' });
    }
  });
};

// Middleware for super admin only
const authenticateSuperAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    try {
      const userId = decoded.userId || decoded.id || decoded._id;
      const user = await User.findById(userId);

      if (!user || user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Super admin access required' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(500).json({ error: 'Authentication failed' });
    }
  });
};

// ============ VOCABULARY ROUTES ============
router.post('/vocabulary/add', authenticateAdmin, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const existing = await VocabularyWord.findOne({ word: req.body.word.toLowerCase() });
    
    if (existing) {
      return res.status(400).json({ error: 'Word already exists' });
    }

    const newWord = new VocabularyWord({
      ...req.body,
      word: req.body.word.toLowerCase(),
      createdBy: userId,
    });

    await newWord.save();
    res.json({ success: true, message: 'Word added successfully', word: newWord });
  } catch (error) {
    console.error('Add vocabulary error:', error);
    res.status(500).json({ error: 'Failed to add vocabulary word' });
  }
});

router.put('/vocabulary/:id', authenticateAdmin, async (req, res) => {
  try {
    const word = await VocabularyWord.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!word) {
      return res.status(404).json({ error: 'Word not found' });
    }

    res.json({ success: true, message: 'Word updated successfully', word });
  } catch (error) {
    console.error('Update vocabulary error:', error);
    res.status(500).json({ error: 'Failed to update word' });
  }
});

router.delete('/vocabulary/:id', authenticateAdmin, async (req, res) => {
  try {
    const word = await VocabularyWord.findByIdAndDelete(req.params.id);
    
    if (!word) {
      return res.status(404).json({ error: 'Word not found' });
    }

    res.json({ success: true, message: 'Word deleted successfully' });
  } catch (error) {
    console.error('Delete vocabulary error:', error);
    res.status(500).json({ error: 'Failed to delete word' });
  }
});

router.get('/vocabulary/all', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, category, difficulty } = req.query;

    let filter = {};
    if (category && category !== 'all') filter.category = category;
    if (difficulty && difficulty !== 'all') filter.difficulty = difficulty;

    const words = await VocabularyWord.find(filter)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await VocabularyWord.countDocuments(filter);

    res.json({
      success: true,
      words,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get vocabulary error:', error);
    res.status(500).json({ error: 'Failed to fetch vocabulary' });
  }
});

// ============ WRITING PROMPTS ROUTES ============
router.post('/writing/add', authenticateAdmin, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const prompt = new WritingPrompt({ ...req.body, createdBy: userId });
    await prompt.save();
    res.json({ success: true, message: 'Writing prompt added', prompt });
  } catch (error) {
    console.error('Add writing prompt error:', error);
    res.status(500).json({ error: 'Failed to add writing prompt' });
  }
});

router.get('/writing/all', authenticateAdmin, async (req, res) => {
  try {
    const { task, difficulty } = req.query;
    let filter = {};
    if (task) filter.task = parseInt(task);
    if (difficulty) filter.difficulty = difficulty;

    const prompts = await WritingPrompt.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, prompts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch writing prompts' });
  }
});

router.put('/writing/:id', authenticateAdmin, async (req, res) => {
  try {
    const prompt = await WritingPrompt.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json({ success: true, message: 'Prompt updated', prompt });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update prompt' });
  }
});

router.delete('/writing/:id', authenticateAdmin, async (req, res) => {
  try {
    await WritingPrompt.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Prompt deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete prompt' });
  }
});

// ============ SPEAKING TOPICS ROUTES ============
router.post('/speaking/add', authenticateAdmin, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const topic = new SpeakingTopic({ ...req.body, createdBy: userId });
    await topic.save();
    res.json({ success: true, message: 'Speaking topic added', topic });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add speaking topic' });
  }
});

router.get('/speaking/all', authenticateAdmin, async (req, res) => {
  try {
    const { part, difficulty } = req.query;
    let filter = {};
    if (part) filter.part = parseInt(part);
    if (difficulty) filter.difficulty = difficulty;

    const topics = await SpeakingTopic.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, topics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch speaking topics' });
  }
});

router.put('/speaking/:id', authenticateAdmin, async (req, res) => {
  try {
    const topic = await SpeakingTopic.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json({ success: true, message: 'Topic updated', topic });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update topic' });
  }
});

router.delete('/speaking/:id', authenticateAdmin, async (req, res) => {
  try {
    await SpeakingTopic.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Topic deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete topic' });
  }
});

// ============ USER MANAGEMENT (Super Admin Only) ============
router.get('/users/all', authenticateSuperAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/users/:id/role', authenticateSuperAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    res.json({ success: true, message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

router.put('/users/:id/status', authenticateSuperAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    res.json({ success: true, message: 'User status updated', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

router.delete('/users/:id', authenticateSuperAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ============ DASHBOARD STATS (Super Admin) ============
router.get('/stats', authenticateSuperAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVocab = await VocabularyWord.countDocuments();
    const totalWriting = await WritingPrompt.countDocuments();
    const totalSpeaking = await SpeakingTopic.countDocuments();
    const totalProgress = await Progress.countDocuments();

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalVocab,
        totalWriting,
        totalSpeaking,
        totalProgress,
        usersByRole,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Make user admin/super_admin
router.post('/make-admin', async (req, res) => {
  try {
    const { email, secretKey, role } = req.body;

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ error: 'Invalid secret key' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role || 'admin'; // Can be 'admin' or 'super_admin'
    await user.save();

    res.json({
      success: true,
      message: `User ${email} is now a ${role || 'admin'}`,
    });
  } catch (error) {
    console.error('Make admin error:', error);
    res.status(500).json({ error: 'Failed to make user admin' });
  }
});

module.exports = router;
