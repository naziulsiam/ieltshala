const cron = require('node-cron');
const User = require('../models/User');
const { sendDailyReminderEmail } = require('../config/email');

// Run every day at 9 AM
const scheduleEmailReminders = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('📧 Sending daily reminder emails...');
    
    try {
      // Get users who have reminders enabled
      const users = await User.find({
        dailyReminderEnabled: true,
        isEmailVerified: true,
      });

      console.log(`Found ${users.length} users for reminders`);

      for (const user of users) {
        try {
          await sendDailyReminderEmail(user.email, user.name, user.language);
          console.log(`✅ Sent reminder to ${user.email}`);
        } catch (error) {
          console.error(`❌ Failed to send to ${user.email}:`, error.message);
        }
      }

      console.log('✅ Daily reminders completed!');
    } catch (error) {
      console.error('❌ Email reminder error:', error);
    }
  });

  console.log('📧 Email reminder scheduler started (runs daily at 9 AM)');
};

module.exports = { scheduleEmailReminders };
