const User = require('../models/User');

// Track daily usage per user
const dailyUsage = new Map();

module.exports = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date().toDateString();
    const key = `${userId}-${today}`;

    // Get current usage
    const usage = dailyUsage.get(key) || 0;

    // Limit: 20 AI evaluations per day for free users
    const maxDailyUse = req.user.subscriptionType === 'premium' ? 100 : 20;

    if (usage >= maxDailyUse) {
      return res.status(429).json({
        success: false,
        message: `Daily limit reached. You can make ${maxDailyUse} AI evaluations per day.`,
      });
    }

    // Increment usage
    dailyUsage.set(key, usage + 1);

    // Clear old entries after 24 hours
    setTimeout(() => dailyUsage.delete(key), 24 * 60 * 60 * 1000);

    next();
  } catch (error) {
    next(error);
  }
};
