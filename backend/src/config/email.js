const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"IELTShala" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email - IELTShala',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to IELTShala! 🎓</h2>
        <p>Thank you for registering. Please verify your email address to get started.</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Verify Email
        </a>
        <p style="color: #666; font-size: 14px;">Or copy this link: ${verificationUrl}</p>
        <p style="color: #666; font-size: 12px;">This link expires in 24 hours.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendDailyReminderEmail = async (email, name, language = 'en') => {
  const subject = language === 'bn' 
    ? 'আজকের অনুশীলন সম্পন্ন করুন! 📚'
    : 'Complete Your Daily Practice! 📚';
  
  const html = language === 'bn' ? `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">হ্যালো ${name}! 👋</h2>
      <p>আপনার দৈনিক IELTS অনুশীলনের সময় হয়েছে!</p>
      <p>আজ এই মডিউলগুলি চেষ্টা করুন:</p>
      <ul>
        <li>🎤 স্পিকিং অনুশীলন</li>
        <li>✍️ রাইটিং টাস্ক</li>
        <li>📖 রিডিং পাসেজ</li>
      </ul>
      <a href="${process.env.CLIENT_URL}/dashboard" 
         style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
        এখন শুরু করুন
      </a>
    </div>
  ` : `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Hello ${name}! 👋</h2>
      <p>It's time for your daily IELTS practice!</p>
      <p>Try these modules today:</p>
      <ul>
        <li>🎤 Speaking Practice</li>
        <li>✍️ Writing Task</li>
        <li>📖 Reading Passage</li>
      </ul>
      <a href="${process.env.CLIENT_URL}/dashboard" 
         style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
        Start Now
      </a>
    </div>
  `;

  const mailOptions = {
    from: `"IELTShala" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendDailyReminderEmail };
