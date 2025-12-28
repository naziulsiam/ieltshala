const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { scheduleEmailReminders } = require('./services/emailScheduler');

// Import routes
const authRoutes = require('./routes/auth');
const speakingRoutes = require('./routes/speaking');
const writingRoutes = require('./routes/writing');
const vocabularyRoutes = require('./routes/vocabulary');
const progressRoutes = require('./routes/progress');
const mockTestRoutes = require('./routes/mockTest');

const app = express();

// Connect to database
connectDB();

// Start email scheduler
scheduleEmailReminders();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/speaking', speakingRoutes);
app.use('/api/writing', writingRoutes);
app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/mock-tests', mockTestRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'IELTShala API is running' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
});
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);
const learnRoutes = require('./routes/learn');
app.use('/api/learn', learnRoutes);
