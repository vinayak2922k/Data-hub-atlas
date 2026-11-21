require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const requestLogger = require('./middleware/logger');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const renderLandingPage = require('./views/landingPage');
const Post = require('./models/Post');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(requestLogger);

// Landing page at GET /
app.get('/', async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  let postCount = 0;
  let userCount = 0;

  if (isConnected) {
    try {
      postCount = await Post.countDocuments();
      userCount = await User.countDocuments();
    } catch {
      // Fallback safely to 0 if count fails during reconnection
    }
  }

  const html = renderLandingPage({
    isConnected,
    postCount,
    userCount,
    dbHost: mongoose.connection.host,
  });

  res.setHeader('Content-Type', 'text/html');
  return res.send(html);
});

// Telemetry & Health endpoint from Sprint 09
app.get('/health', async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  let postCount = 0;

  if (isConnected) {
    try {
      postCount = await Post.countDocuments();
    } catch {
      postCount = 0;
    }
  }

  return res.status(200).json({
    success: true,
    message: 'The Data Hub is healthy and operational',
    data: {
      status: 'UP',
      database: isConnected ? 'connected' : 'disconnected',
      totalPosts: postCount,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  });
});

// Mount modular routes
app.use('/posts', postRoutes);
app.use('/users', userRoutes);
app.use('/', authRoutes);

// Catch-all 404 handler for undefined endpoints
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - endpoint does not exist`,
    data: null,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled application error:', err.message);
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    data: null,
  });
});

// Connect to MongoDB Atlas first, then start listening
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
