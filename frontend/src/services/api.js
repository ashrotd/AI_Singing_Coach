// ============================================
// API SERVICE
// ============================================
// This file centralizes all API calls to the backend
// Instead of writing axios.get() everywhere, we have clean functions

import axios from 'axios';

// Base URL for API (from environment variable or default)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ============================================
// LEARNING NOTE: Why create a service layer?
// ============================================
// Instead of:
//   axios.get('http://localhost:3001/api/sessions') everywhere
// We have:
//   api.getSessions() - cleaner and reusable!
//
// If API URL changes, we only update it in ONE place

// ============================================
// SESSION API CALLS
// ============================================

/**
 * Get all sessions
 * @param {Object} params - Query parameters (optional)
 * @param {string} params.user_id - Filter by user ID
 * @param {number} params.limit - Max number of results
 * @param {number} params.offset - Skip this many results
 * @returns {Promise<Array>} Array of session objects
 */
export const getSessions = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/api/sessions`, { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
};

/**
 * Get a specific session by ID
 * @param {string} id - Session ID
 * @returns {Promise<Object>} Session object
 */
export const getSessionById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/sessions/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching session:', error);
    throw error;
  }
};

/**
 * Create a new session
 * @param {Object} sessionData - Session data to create
 * @param {string} sessionData.audio_url - URL to audio file
 * @param {Object} sessionData.pitch_data - Pitch analysis data
 * @param {string} sessionData.feedback - AI feedback
 * @param {number} sessionData.score - Score (0-100)
 * @param {number} sessionData.duration_seconds - Recording duration
 * @returns {Promise<Object>} Created session object
 */
export const createSession = async (sessionData) => {
  try {
    const response = await axios.post(`${API_URL}/api/sessions`, sessionData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

/**
 * Update an existing session
 * @param {string} id - Session ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated session object
 */
export const updateSession = async (id, updates) => {
  try {
    const response = await axios.put(`${API_URL}/api/sessions/${id}`, updates);
    return response.data.data;
  } catch (error) {
    console.error('Error updating session:', error);
    throw error;
  }
};

/**
 * Delete a session
 * @param {string} id - Session ID
 * @returns {Promise<void>}
 */
export const deleteSession = async (id) => {
  try {
    await axios.delete(`${API_URL}/api/sessions/${id}`);
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};

/**
 * Get user statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Statistics object
 */
export const getUserStats = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/api/sessions/user/${userId}/stats`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

// ============================================
// HEALTH CHECK
// ============================================

/**
 * Check if backend is healthy
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/health`);
    return response.data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};

// ============================================
// COACHING API CALLS
// ============================================

/**
 * Get AI coaching feedback for a session
 * @param {Object} sessionData - Session analysis data
 * @param {number} sessionData.score - Score (0-100)
 * @param {Object} sessionData.pitch_data - Pitch analysis
 * @param {number} sessionData.duration_seconds - Duration
 * @param {string} sessionData.session_id - Optional session ID to update
 * @returns {Promise<Object>} Coaching feedback
 */
export const getCoachingFeedback = async (sessionData) => {
  try {
    const response = await axios.post(`${API_URL}/api/coaching/analyze`, sessionData);
    return response.data;
  } catch (error) {
    console.error('Error getting coaching feedback:', error);
    throw error;
  }
};

/**
 * Get quick text feedback
 * @param {Object} sessionData - Session data
 * @returns {Promise<string>} Quick feedback text
 */
export const getQuickFeedback = async (sessionData) => {
  try {
    const response = await axios.post(`${API_URL}/api/coaching/quick-feedback`, sessionData);
    return response.data.feedback;
  } catch (error) {
    console.error('Error getting quick feedback:', error);
    throw error;
  }
};

/**
 * Check if AI coaching is configured
 * @returns {Promise<Object>} AI status
 */
export const getAIStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/coaching/status`);
    return response.data;
  } catch (error) {
    console.error('Error checking AI status:', error);
    throw error;
  }
};

// ============================================
// EXPORT ALL AS DEFAULT OBJECT (alternative usage)
// ============================================
// You can import like:
// import api from './services/api'
// api.getSessions()

const api = {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  getUserStats,
  checkHealth,
  getCoachingFeedback,
  getQuickFeedback,
  getAIStatus
};

export default api;
