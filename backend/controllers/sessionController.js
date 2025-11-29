// ============================================
// SESSION CONTROLLER
// ============================================
// This file handles all the business logic for managing singing sessions
// Think of it as the "brain" that processes requests from the API routes

const supabase = require('../utils/supabase');

// ============================================
// LEARNING NOTE: What is a Controller?
// ============================================
// Controllers handle the logic between routes (URLs) and database
// Route says "someone wants to create a session"
// Controller says "okay, let me validate the data and save it to the database"

// ============================================
// CREATE a new session
// ============================================
// This is called when a user finishes recording and wants to save it

const createSession = async (req, res) => {
  try {
    // req.body contains JSON data sent from the frontend
    const { user_id, audio_url, pitch_data, feedback, score, duration_seconds } = req.body;

    // Always validate user input before saving to database!
    if (!audio_url) {
      return res.status(400).json({
        success: false,
        error: 'audio_url is required'
      });
    }

    // STEP 3: Insert into database using Supabase
    const { data, error } = await supabase
      .from('sessions')
      .insert([
        {
          user_id: user_id || null, // Optional for now (will be required when we add auth)
          audio_url,
          pitch_data: pitch_data || null,
          feedback: feedback || null,
          score: score || null,
          duration_seconds: duration_seconds || null
        }
      ])
      .select(); // .select() returns the created record

    // STEP 4: Handle database errors
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    // STEP 5: Return success response
    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: data[0] // Return the created session
    });

  } catch (err) {
    // Catch any unexpected errors
    console.error('Create session error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};


// This retrieves a list of sessions, useful for showing history

const getAllSessions = async (req, res) => {
  try {
    // LEARNING NOTE: Query parameters
    // URL might look like: /api/sessions?user_id=123&limit=10
    const { user_id, limit = 50, offset = 0 } = req.query;

    // Start building the query
    let query = supabase
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: false }); // Newest first

    // Add filter if user_id provided
    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      data: data,
      count: data.length,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (err) {
    console.error('Get sessions error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};


const getSessionById = async (req, res) => {
  try {
    // Get ID from URL parameters
    // URL looks like: /api/sessions/123-456-789
    const { id } = req.params;

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', id)
      .single(); // .single() expects exactly one result

    if (error) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: data
    });

  } catch (err) {
    console.error('Get session by ID error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow updating the ID or created_at
    delete updates.id;
    delete updates.created_at;

    const { data, error } = await supabase
      .from('sessions')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: 'Session updated successfully',
      data: data[0]
    });

  } catch (err) {
    console.error('Update session error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};


const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });

  } catch (err) {
    console.error('Delete session error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};


const getUserStats = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Get all sessions for this user
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('score, duration_seconds, created_at')
      .eq('user_id', user_id)
      .not('score', 'is', null); // Only sessions with scores

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    // Calculate statistics
    const totalSessions = sessions.length;
    const averageScore = totalSessions > 0
      ? sessions.reduce((sum, s) => sum + s.score, 0) / totalSessions
      : 0;
    const bestScore = totalSessions > 0
      ? Math.max(...sessions.map(s => s.score))
      : 0;
    const totalPracticeTime = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);

    res.json({
      success: true,
      data: {
        total_sessions: totalSessions,
        average_score: Math.round(averageScore * 10) / 10,
        best_score: bestScore,
        total_practice_time_seconds: totalPracticeTime,
        total_practice_time_minutes: Math.round(totalPracticeTime / 60)
      }
    });

  } catch (err) {
    console.error('Get user stats error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

module.exports = {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
  getUserStats
};
