const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const supabase = require('./utils/supabase');

// Import routes
const sessionRoutes = require('./routes/sessions');
const coachingRoutes = require('./routes/coaching');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());

// Parse JSON request bodies
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


// Mount the session routes under /api/sessions
app.use('/api/sessions', sessionRoutes);

// Mount the coaching routes under /api/coaching
app.use('/api/coaching', coachingRoutes);


// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AI Singing Coach API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      dbTest: '/api/db-test',
      sessions: '/api/sessions',
      coaching: '/api/coaching'
    }
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Singing Coach API is running!',
    timestamp: new Date().toISOString(),
    supabase: supabase ? 'connected' : 'disconnected'
  });
});

// Test Supabase connection route
app.get('/api/db-test', async (req, res) => {
  try {
    // Try to query from any table (will fail if no tables exist, but that's ok)
    const { data, error } = await supabase
      .from('_test')
      .select('*')
      .limit(1);
    
    // Even if table doesn't exist, connection works if we get a specific error
    if (error && error.code === 'PGRST116') {
      return res.json({
        status: 'success',
        message: 'Supabase connected! (No tables yet, but connection works)',
        details: 'Database is ready to create tables'
      });
    }
    
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Supabase connection failed',
        error: error.message
      });
    }
    
    res.json({
      status: 'success',
      message: 'Supabase connected and tables exist!',
      data: data
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Database test failed',
      error: err.message
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  DB test: http://localhost:${PORT}/api/db-test`);
});