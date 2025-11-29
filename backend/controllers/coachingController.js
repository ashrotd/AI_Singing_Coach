// ============================================
// COACHING CONTROLLER
// ============================================
// Handles requests for AI-powered coaching feedback

const claudeService = require('../services/claudeService');
const supabase = require('../utils/supabase');

// ============================================
// GET COACHING FEEDBACK FOR A SESSION
// ============================================
/**
 * Analyzes a session and returns AI coaching feedback
 * @route POST /api/coaching/analyze
 */
const analyzeSession = async (req, res) => {
  try {
    const { session_id, score, pitch_data, duration_seconds } = req.body;

    // Validate input
    if (!score && score !== 0) {
      return res.status(400).json({
        success: false,
        error: 'Score is required'
      });
    }

    // Prepare session data for AI analysis
    const sessionData = {
      score,
      pitch_data: pitch_data || {},
      duration_seconds: duration_seconds || 0
    };

    // Get AI feedback from Claude
    const result = await claudeService.generateCoachingFeedback(sessionData);

    // If session_id provided, update the session with feedback
    if (session_id) {
      const feedbackText = result.feedback.summary;

      await supabase
        .from('sessions')
        .update({ feedback: feedbackText })
        .eq('id', session_id);
    }

    // Return the coaching feedback
    res.json({
      success: true,
      coaching: result.feedback,
      using_ai: result.success !== false,
      model: result.model || 'mock',
      fallback: result.fallback || false
    });

  } catch (error) {
    console.error('Error in analyzeSession:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate coaching feedback',
      details: error.message
    });
  }
};

// ============================================
// GET SIMPLE FEEDBACK
// ============================================
/**
 * Returns a quick summary feedback
 * @route POST /api/coaching/quick-feedback
 */
const getQuickFeedback = async (req, res) => {
  try {
    const { score, pitch_data, duration_seconds } = req.body;

    if (!score && score !== 0) {
      return res.status(400).json({
        success: false,
        error: 'Score is required'
      });
    }

    const sessionData = { score, pitch_data, duration_seconds };
    const feedback = await claudeService.generateSimpleFeedback(sessionData);

    res.json({
      success: true,
      feedback
    });

  } catch (error) {
    console.error('Error in getQuickFeedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate feedback'
    });
  }
};

// ============================================
// CHECK AI STATUS
// ============================================
/**
 * Check if AI service is configured and available
 * @route GET /api/coaching/status
 */
const getAIStatus = async (req, res) => {
  try {
    const isConfigured = claudeService.isConfigured();

    res.json({
      success: true,
      ai_configured: isConfigured,
      message: isConfigured
        ? 'AI coaching is active'
        : 'Using mock feedback (configure ANTHROPIC_API_KEY to enable AI)'
    });

  } catch (error) {
    console.error('Error checking AI status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check AI status'
    });
  }
};

// ============================================
// EXPORT FUNCTIONS
// ============================================
module.exports = {
  analyzeSession,
  getQuickFeedback,
  getAIStatus
};
