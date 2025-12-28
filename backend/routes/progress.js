const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Progress = require('../models/Progress');
const StudyStreak = require('../models/StudyStreak');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Save practice activity
router.post('/activity', authenticateToken, async (req, res) => {
  try {
    const { module, activityType, score, details, feedback } = req.body;

    const progress = new Progress({
      userId: req.user.userId,
      module,
      activityType,
      score,
      details,
      feedback,
    });

    await progress.save();

    // Update study streak
    await updateStudyStreak(req.user.userId);

    res.json({
      success: true,
      message: 'Progress saved successfully',
      progress,
    });
  } catch (error) {
    console.error('Save progress error:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// Get user's progress summary
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get total activities count
    const totalActivities = await Progress.countDocuments({ userId });

    // Get activities by module
    const moduleStats = await Progress.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$module',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' },
          lastActivity: { $max: '$completedAt' },
        },
      },
    ]);

    // Get recent activities
    const recentActivities = await Progress.find({ userId })
      .sort({ completedAt: -1 })
      .limit(10)
      .select('module activityType score completedAt details');

    // Get study streak
    const streak = await StudyStreak.findOne({ userId });

    // Get weekly progress (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyProgress = await Progress.find({
      userId,
      completedAt: { $gte: weekAgo },
    }).select('module score completedAt');

    res.json({
      success: true,
      data: {
        totalActivities,
        moduleStats,
        recentActivities,
        streak: {
          current: streak?.currentStreak || 0,
          longest: streak?.longestStreak || 0,
          totalDays: streak?.totalStudyDays || 0,
        },
        weeklyProgress,
      },
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Get progress by module
router.get('/module/:module', authenticateToken, async (req, res) => {
  try {
    const { module } = req.params;
    const userId = req.user.userId;

    const activities = await Progress.find({ userId, module })
      .sort({ completedAt: -1 })
      .limit(50);

    const stats = await Progress.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), module } },
      {
        $group: {
          _id: null,
          totalActivities: { $sum: 1 },
          avgScore: { $avg: '$score' },
          maxScore: { $max: '$score' },
          totalTimeSpent: { $sum: '$details.timeSpent' },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        activities,
        stats: stats[0] || {},
      },
    });
  } catch (error) {
    console.error('Get module progress error:', error);
    res.status(500).json({ error: 'Failed to fetch module progress' });
  }
});

// Get performance chart data (last 30 days)
router.get('/chart', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const chartData = await Progress.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          completedAt: { $gte: thirtyDaysAgo },
          score: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
            module: '$module',
          },
          avgScore: { $avg: '$score' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.date': 1 },
      },
    ]);

    res.json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    console.error('Get chart data error:', error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

// Helper function to update study streak
async function updateStudyStreak(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = await StudyStreak.findOne({ userId });

  if (!streak) {
    streak = new StudyStreak({
      userId,
      currentStreak: 1,
      longestStreak: 1,
      lastStudyDate: today,
      totalStudyDays: 1,
      studyDates: [today],
    });
  } else {
    const lastStudy = new Date(streak.lastStudyDate);
    lastStudy.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));

    // Check if already studied today
    const studiedToday = streak.studyDates.some(
      (date) => new Date(date).toDateString() === today.toDateString()
    );

    if (!studiedToday) {
      if (daysDiff === 1) {
        // Consecutive day
        streak.currentStreak += 1;
      } else if (daysDiff > 1) {
        // Streak broken
        streak.currentStreak = 1;
      }

      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }

      streak.lastStudyDate = today;
      streak.totalStudyDays += 1;
      streak.studyDates.push(today);
    }
  }

  await streak.save();
}

module.exports = router;
