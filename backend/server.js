require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware - MUST come before routes
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

console.log('⏳ Starting server...');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    console.log('⚠️  Continuing without MongoDB (some features may not work)');
  });

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'IELTShala API is running',
    groq: process.env.GROQ_API_KEY ? 'configured' : 'missing'
  });
});

// Import routes
try {
  const authRoutes = require('./src/routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (err) {
  console.error('❌ Error loading auth routes:', err.message);
}

try {
  const evaluationRoutes = require('./src/routes/evaluation');
  app.use('/api/evaluate', evaluationRoutes);
  console.log('✅ Evaluation routes loaded');
} catch (err) {
  console.error('❌ Error loading evaluation routes:', err.message);
}

try {
  const progressRoutes = require('./src/routes/progress');
  app.use('/api/progress', progressRoutes);
  console.log('✅ Progress routes loaded');
} catch (err) {
  console.error('❌ Error loading progress routes:', err.message);
}

try {
  const studyPlanRoutes = require('./src/routes/studyplan');
  app.use('/api/studyplan', studyPlanRoutes);
  console.log('✅ Study plan routes loaded');
} catch (err) {
  console.error('❌ Error loading study plan routes:', err.message);
}

try {
  const dashboardRoutes = require('./src/routes/dashboard');
  app.use('/api/dashboard', dashboardRoutes);
  console.log('✅ Dashboard routes loaded');
} catch (err) {
  console.error('❌ Error loading dashboard routes:', err.message);
}

try {
  const vocabularyRoutes = require('./src/routes/vocabulary');
  app.use('/api/vocabulary', vocabularyRoutes);
  console.log('✅ Vocabulary routes loaded');
} catch (err) {
  console.error('❌ Error loading vocabulary routes:', err.message);
}

try {
  const adminRoutes = require('./src/routes/admin');
  app.use('/api/admin', adminRoutes);
  console.log('✅ Admin routes loaded');
} catch (err) {
  console.error('❌ Error loading admin routes:', err.message);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.path 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n🚀 Server running on http://localhost:' + PORT);
  console.log('📊 Health check: http://localhost:' + PORT + '/api/health');
  console.log('👨‍💼 Admin: POST http://localhost:' + PORT + '/api/admin\n');
});
