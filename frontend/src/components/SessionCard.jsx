
import './SessionCard.css';

function SessionCard({ session, onDelete }) {

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format duration (seconds to mm:ss)
  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get color based on score
  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981'; // green
    if (score >= 75) return '#f59e0b'; // yellow
    if (score >= 60) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  // Handle delete with confirmation
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      onDelete(session.id);
    }
  };

  return (
    <div className="session-card">
      {/* Score badge */}
      <div
        className="score-badge"
        style={{ backgroundColor: session.score ? getScoreColor(session.score) : '#6b7280' }}
      >
        {session.score ? `${session.score}%` : 'N/A'}
      </div>

      {/* Session info */}
      <div className="session-info">
        <div className="session-header">
          <h3>Recording Session</h3>
          <span className="session-date">{formatDate(session.created_at)}</span>
        </div>

        <div className="session-stats">
          <div className="stat">
            <span className="stat-label">Duration:</span>
            <span className="stat-value">{formatDuration(session.duration_seconds)}</span>
          </div>
          {session.pitch_data && (
            <div className="stat">
              <span className="stat-label">Notes:</span>
              <span className="stat-value">
                {session.pitch_data.notes?.length || 0} analyzed
              </span>
            </div>
          )}
        </div>

        {/* Feedback section */}
        {session.feedback && (
          <div className="session-feedback">
            <strong>Feedback:</strong>
            <p>{session.feedback}</p>
          </div>
        )}

        {/* Actions */}
        <div className="session-actions">
          <button className="btn-view" onClick={() => alert('View details coming soon!')}>
            View Details
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default SessionCard;
