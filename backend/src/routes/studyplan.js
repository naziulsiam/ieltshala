const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const StudyPlan = require('../models/StudyPlan');
const Progress = require('../models/Progress');
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
      console.error('JWT verification error:', err);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  });
};

// Generate personalized study plan
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { targetBand, testDate, studyHoursPerDay } = req.body;
    const userId = req.user.userId || req.user.id || req.user._id;

    console.log('Generating study plan for user:', userId);

    if (!userId) {
      return res.status(400).json({ error: 'User ID not found in token' });
    }

    // Get user's current performance from progress data
    const moduleStats = await Progress.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$module',
          avgScore: { $avg: '$score' },
          count: { $sum: 1 },
        },
      },
    ]);

    console.log('Module stats:', moduleStats);

    // Determine focus areas (modules below target or with no data)
    const focusAreas = [];
    const modules = ['speaking', 'writing', 'reading', 'listening'];

    modules.forEach((module) => {
      const stat = moduleStats.find((s) => s._id === module);
      if (!stat) {
        focusAreas.push({
          module,
          priority: 5,
          reason: 'No practice history - needs attention',
        });
      } else if (stat.avgScore < targetBand) {
        const gap = targetBand - stat.avgScore;
        focusAreas.push({
          module,
          priority: Math.min(5, Math.ceil(gap)),
          reason: `Current avg: ${stat.avgScore.toFixed(1)}, Target: ${targetBand}`,
        });
      }
    });

    // If no focus areas, add balanced practice
    if (focusAreas.length === 0) {
      modules.forEach((module) => {
        focusAreas.push({
          module,
          priority: 3,
          reason: 'Maintaining current level',
        });
      });
    }

    console.log('Focus areas:', focusAreas);

    // Generate weekly plan
    const weeklyPlan = generateWeeklyPlan(focusAreas, studyHoursPerDay, targetBand);

    // Save or update study plan
    let studyPlan = await StudyPlan.findOne({ userId });

    if (studyPlan) {
      studyPlan.targetBand = targetBand;
      studyPlan.testDate = testDate;
      studyPlan.studyHoursPerDay = studyHoursPerDay;
      studyPlan.focusAreas = focusAreas;
      studyPlan.weeklyPlan = weeklyPlan;
      studyPlan.lastUpdated = new Date();
    } else {
      studyPlan = new StudyPlan({
        userId,
        targetBand,
        testDate,
        studyHoursPerDay,
        focusAreas,
        weeklyPlan,
      });
    }

    await studyPlan.save();
    console.log('Study plan saved successfully');

    res.json({
      success: true,
      message: 'Study plan generated successfully',
      studyPlan,
    });
  } catch (error) {
    console.error('Generate study plan error:', error);
    res.status(500).json({ 
      error: 'Failed to generate study plan',
      details: error.message 
    });
  }
});

// Get current study plan
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID not found in token' });
    }

    const studyPlan = await StudyPlan.findOne({ userId });

    if (!studyPlan) {
      return res.json({
        success: true,
        studyPlan: null,
        message: 'No study plan found',
      });
    }

    res.json({
      success: true,
      studyPlan,
    });
  } catch (error) {
    console.error('Get study plan error:', error);
    res.status(500).json({ error: 'Failed to fetch study plan' });
  }
});

// Mark task as completed
router.post('/complete-task', authenticateToken, async (req, res) => {
  try {
    const { dateIndex, taskId } = req.body;
    const userId = req.user.userId || req.user.id || req.user._id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID not found in token' });
    }

    const studyPlan = await StudyPlan.findOne({ userId });

    if (!studyPlan) {
      return res.status(404).json({ error: 'Study plan not found' });
    }

    const dayPlan = studyPlan.weeklyPlan[dateIndex];
    if (!dayPlan) {
      return res.status(404).json({ error: 'Day plan not found' });
    }

    const task = dayPlan.tasks.find((t) => t.id === taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.completed = true;
    task.completedAt = new Date();

    // Check if all tasks for the day are completed
    const allCompleted = dayPlan.tasks.every((t) => t.completed);
    dayPlan.completed = allCompleted;

    await studyPlan.save();

    res.json({
      success: true,
      message: 'Task marked as completed',
      studyPlan,
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
});

// Helper function to generate weekly plan
function generateWeeklyPlan(focusAreas, studyHoursPerDay, targetBand) {
  const weeklyPlan = [];
  const today = new Date();
  const dailyMinutes = studyHoursPerDay * 60;

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);

    const tasks = [];
    let totalMinutes = 0;

    // Sort focus areas by priority
    const sortedAreas = [...focusAreas].sort((a, b) => b.priority - a.priority);

    // Distribute time across modules based on priority
    sortedAreas.forEach((area, index) => {
      if (totalMinutes >= dailyMinutes) return;

      const priorityWeight = area.priority / focusAreas.reduce((sum, a) => sum + a.priority, 0);
      const allocatedMinutes = Math.floor(dailyMinutes * priorityWeight);

      if (allocatedMinutes >= 20) {
        // Practice task
        tasks.push({
          id: `task-${i}-${index}-1`,
          title: `${capitalize(area.module)} Practice`,
          module: area.module,
          duration: Math.min(45, allocatedMinutes),
          type: 'practice',
          description: `Complete practice exercises to improve your ${area.module} skills`,
          completed: false,
        });

        totalMinutes += Math.min(45, allocatedMinutes);

        // Add review/learn task if time permits
        if (allocatedMinutes > 45 && totalMinutes < dailyMinutes) {
          tasks.push({
            id: `task-${i}-${index}-2`,
            title: `${capitalize(area.module)} Tips & Strategies`,
            module: area.module,
            duration: Math.min(30, allocatedMinutes - 45),
            type: 'learn',
            description: `Review strategies and tips for ${area.module}`,
            completed: false,
          });

          totalMinutes += Math.min(30, allocatedMinutes - 45);
        }
      }
    });

    // Add vocabulary building (every day)
    if (totalMinutes + 15 <= dailyMinutes) {
      tasks.push({
        id: `task-${i}-vocab`,
        title: 'Vocabulary Building',
        module: 'vocabulary',
        duration: 15,
        type: 'learn',
        description: 'Learn new words and practice flashcards',
        completed: false,
      });
      totalMinutes += 15;
    }

    // Add mock test on day 6 (weekend)
    if (i === 6 && targetBand >= 6.5) {
      tasks.push({
        id: `task-${i}-mock`,
        title: 'Mini Mock Test',
        module: 'speaking',
        duration: 30,
        type: 'mock_test',
        description: 'Complete a timed practice test',
        completed: false,
      });
      totalMinutes += 30;
    }

    weeklyPlan.push({
      date,
      tasks,
      totalMinutes,
      completed: false,
    });
  }

  return weeklyPlan;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = router;
