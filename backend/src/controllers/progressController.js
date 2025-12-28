const Progress = require('../models/Progress');
const User = require('../models/User');
const { SpeakingEvaluation } = require('../models/Speaking');
const WritingEvaluation = require('../models/Writing');
const { UserVocabularyProgress } = require('../models/Vocabulary');

// Get user progress overview
exports.getOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user info
    const user = await User.findById(userId);
    
    // Get speaking evaluations
    const speakingEvals = await SpeakingEvaluation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get writing evaluations
    const writingEvals = await WritingEvaluation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get vocabulary progress
    const vocabStats = await UserVocabularyProgress.aggregate([
      { $match: { userId: user._id } },
      { 
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate averages
    const avgSpeakingScore = speakingEvals.length > 0
      ? speakingEvals.reduce((sum, e) => sum + (e.scores?.overall || 0), 0) / speakingEvals.length
      : 0;

    const avgWritingScore = writingEvals.length > 0
      ? writingEvals.reduce((sum, e) => sum + (e.scores?.overall || 0), 0) / writingEvals.length
      : 0;

    // Get last 7 days activity
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentProgress = await Progress.find({
      userId,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: 1 });

    res.json({
      success: true,
      data: {
        user: {
          name: user.name,
          streak: user.streak,
          totalStudyHours: user.totalStudyHours,
        },
        scores: {
          speaking: avgSpeakingScore.toFixed(1),
          writing: avgWritingScore.toFixed(1),
          overall: ((avgSpeakingScore + avgWritingScore) / 2).toFixed(1),
        },
        vocabulary: {
          mastered: vocabStats.find(v => v._id === 'mastered')?.count || 0,
          learning: vocabStats.find(v => v._id === 'learning')?.count || 0,
          new: vocabStats.find(v => v._id === 'new')?.count || 0,
        },
        recentActivity: recentProgress,
        totalTests: {
          speaking: speakingEvals.length,
          writing: writingEvals.length,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get progress',
      error: error.message,
    });
  }
};

// Get chart data
exports.getChartData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get speaking scores over time
    const speakingScores = await SpeakingEvaluation.find({
      userId,
      createdAt: { $gte: startDate },
    })
    .select('scores.overall createdAt')
    .sort({ createdAt: 1 });

    // Get writing scores over time
    const writingScores = await WritingEvaluation.find({
      userId,
      createdAt: { $gte: startDate },
    })
    .select('scores.overall createdAt')
    .sort({ createdAt: 1 });

    // Get daily activity
    const dailyActivity = await Progress.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate },
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalMinutes: { $sum: '$totalMinutes' },
          activities: { $sum: { $size: '$activities' } },
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        speaking: speakingScores.map(s => ({
          date: s.createdAt,
          score: s.scores.overall,
        })),
        writing: writingScores.map(w => ({
          date: w.createdAt,
          score: w.scores.overall,
        })),
        dailyActivity: dailyActivity.map(d => ({
          date: d._id,
          minutes: d.totalMinutes,
          activities: d.activities,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get chart data',
      error: error.message,
    });
  }
};

// Log activity
exports.logActivity = async (req, res) => {
  try {
    const { type, score, duration, completed } = req.body;
    const userId = req.user.id;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let progress = await Progress.findOne({
      userId,
      date: { $gte: today },
    });

    if (!progress) {
      progress = new Progress({
        userId,
        date: new Date(),
        activities: [],
        totalMinutes: 0,
      });
    }

    progress.activities.push({ type, score, duration, completed });
    progress.totalMinutes += duration || 0;

    await progress.save();

    // Update user study hours
    const user = await User.findById(userId);
    user.totalStudyHours = Math.round((user.totalStudyHours + (duration || 0) / 60) * 10) / 10;
    await user.save();

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to log activity',
      error: error.message,
    });
  }
};
