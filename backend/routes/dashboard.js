const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Progress = require('../models/Progress');
const StudyStreak = require('../models/StudyStreak');
const StudyPlan = require('../models/StudyPlan');
const User = require('../models/User');
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

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID not found in token' });
    }

    // Get user info
    const user = await User.findById(userId).select('name email targetBand');

    // Get total activities
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

    // Get study streak
    const streak = await StudyStreak.findOne({ userId });

    // Get today's progress
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayActivities = await Progress.countDocuments({
      userId,
      completedAt: { $gte: today, $lt: tomorrow },
    });

    // Get recent activities (last 5)
    const recentActivities = await Progress.find({ userId })
      .sort({ completedAt: -1 })
      .limit(5)
      .select('module activityType score completedAt details');

    // Get weekly progress (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyActivities = await Progress.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          completedAt: { $gte: weekAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
          count: { $sum: 1 },
          avgScore: { $avg: '$score' },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    // Get study plan
    const studyPlan = await StudyPlan.findOne({ userId }).select('targetBand studyHoursPerDay weeklyPlan');

    // Calculate today's tasks if study plan exists
    let todaysTasks = null;
    if (studyPlan && studyPlan.weeklyPlan) {
      const todayPlan = studyPlan.weeklyPlan.find((day) => {
        const dayDate = new Date(day.date);
        dayDate.setHours(0, 0, 0, 0);
        return dayDate.getTime() === today.getTime();
      });

      if (todayPlan) {
        const completedTasks = todayPlan.tasks.filter((t) => t.completed).length;
        todaysTasks = {
          total: todayPlan.tasks.length,
          completed: completedTasks,
          tasks: todayPlan.tasks,
        };
      }
    }

    // Calculate overall progress towards target
    let overallProgress = null;
    if (user.targetBand && moduleStats.length > 0) {
      const avgScore = moduleStats.reduce((sum, stat) => sum + stat.avgScore, 0) / moduleStats.length;
      const progressPercent = Math.min(100, (avgScore / user.targetBand) * 100);
      overallProgress = {
        current: avgScore.toFixed(1),
        target: user.targetBand,
        percentage: progressPercent.toFixed(0),
      };
    }

    res.json({
      success: true,
      data: {
        user: {
          name: user?.name || 'User',
          email: user?.email || '',
          targetBand: user?.targetBand || 7.0,
        },
        totalActivities,
        todayActivities,
        moduleStats,
        streak: {
          current: streak?.currentStreak || 0,
          longest: streak?.longestStreak || 0,
          totalDays: streak?.totalStudyDays || 0,
        },
        recentActivities,
        weeklyActivities,
        todaysTasks,
        overallProgress,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard stats',
      details: error.message 
    });
  }
});

module.exports = router;
