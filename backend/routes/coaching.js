// ============================================
// COACHING ROUTES
// ============================================
// API routes for AI-powered coaching feedback

const express = require('express');
const router = express.Router();
const coachingController = require('../controllers/coachingController');

// ============================================
// ROUTES
// ============================================

// POST /api/coaching/analyze
// Analyzes a session and returns detailed coaching feedback
// Body: { score, pitch_data, duration_seconds, session_id (optional) }
router.post('/analyze', coachingController.analyzeSession);

// POST /api/coaching/quick-feedback
// Returns a quick summary feedback
// Body: { score, pitch_data, duration_seconds }
router.post('/quick-feedback', coachingController.getQuickFeedback);

// GET /api/coaching/status
// Check if AI service is configured
router.get('/status', coachingController.getAIStatus);

module.exports = router;
