const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');


// GET /api/sessions
// Retrieve all sessions (with optional filters)
// Example: GET /api/sessions?user_id=123&limit=10
router.get('/', sessionController.getAllSessions);


router.post('/', sessionController.createSession);

// GET /api/sessions/:id
// Get a specific session by ID
router.get('/:id', sessionController.getSessionById);

// PUT /api/sessions/:id
// Update an existing session
router.put('/:id', sessionController.updateSession);

// DELETE /api/sessions/:id
// Delete a session
router.delete('/:id', sessionController.deleteSession);

// GET /api/sessions/user/:user_id/stats
router.get('/user/:user_id/stats', sessionController.getUserStats);


module.exports = router;

