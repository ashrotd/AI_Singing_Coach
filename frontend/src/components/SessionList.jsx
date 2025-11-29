
import { useState, useEffect } from 'react';
import SessionCard from './SessionCard';
import { getSessions, deleteSession } from '../services/api';
import './SessionList.css';

function SessionList() {

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    fetchSessions();
  }, []); // Empty dependency array = run once on mount

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call our API service
      const data = await getSessions();

      // Update state with the fetched data
      setSessions(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      setError('Failed to load sessions. Make sure the backend is running.');
      setLoading(false);
    }
  };


  const handleDelete = async (sessionId) => {
    try {
      // Delete from backend
      await deleteSession(sessionId);

      // Remove from local state (immediate UI update)
      setSessions(sessions.filter(session => session.id !== sessionId));

      alert('Session deleted successfully!');
    } catch (err) {
      console.error('Failed to delete session:', err);
      alert('Failed to delete session. Please try again.');
    }
  };


  // Show loading state
  if (loading) {
    return (
      <div className="session-list">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading sessions...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="session-list">
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchSessions} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (sessions.length === 0) {
    return (
      <div className="session-list">
        <div className="empty-state">
          <h2>🎤 No Sessions Yet</h2>
          <p>Start recording to see your singing sessions here!</p>
          <button className="btn-primary" onClick={() => alert('Recording feature coming soon!')}>
            Record Your First Session
          </button>
        </div>
      </div>
    );
  }

  // Show sessions
  return (
    <div className="session-list">
      <div className="session-list-header">
        <h2>📊 Your Singing Sessions</h2>
        <p className="session-count">
          {sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded
        </p>
      </div>

      <div className="sessions-container">
        {sessions.map(session => (
          <SessionCard
            key={session.id}
            session={session}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <button onClick={fetchSessions} className="refresh-btn">
        🔄 Refresh
      </button>
    </div>
  );
}

export default SessionList;
