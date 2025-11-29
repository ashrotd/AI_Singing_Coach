
import { useState, useEffect } from 'react';
import { getSessions } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalSessions: 0,
    averageScore: 0,
    bestScore: 0,
    totalPracticeTime: 0,
    recentProgress: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);

      // Get all sessions
      const sessions = await getSessions();

      // Filter sessions with scores
      const sessionsWithScores = sessions.filter(s => s.score !== null);

      // Calculate statistics
      const totalSessions = sessions.length;

      const averageScore = sessionsWithScores.length > 0
        ? sessionsWithScores.reduce((sum, s) => sum + s.score, 0) / sessionsWithScores.length
        : 0;

      const bestScore = sessionsWithScores.length > 0
        ? Math.max(...sessionsWithScores.map(s => s.score))
        : 0;

      const totalPracticeTime = sessions.reduce(
        (sum, s) => sum + (s.duration_seconds || 0),
        0
      );

      // Get last 5 sessions for progress chart
      const recentProgress = sessions
        .slice(0, 5)
        .reverse()
        .map(s => ({
          date: new Date(s.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          }),
          score: s.score || 0
        }));

      setStats({
        totalSessions,
        averageScore: Math.round(averageScore * 10) / 10,
        bestScore,
        totalPracticeTime: Math.round(totalPracticeTime / 60), // Convert to minutes
        recentProgress
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setLoading(false);
    }
  };

  
  // Get performance level based on average score
  const getPerformanceLevel = (score) => {
    if (score >= 90) return { level: 'Excellent', color: '#10b981', emoji: '🌟' };
    if (score >= 75) return { level: 'Good', color: '#f59e0b', emoji: '🎵' };
    if (score >= 60) return { level: 'Fair', color: '#f97316', emoji: '🎤' };
    return { level: 'Improving', color: '#6b7280', emoji: '📈' };
  };

  // Get motivational message
  const getMotivationalMessage = () => {
    const { totalSessions, averageScore } = stats;

    if (totalSessions === 0) {
      return "Start your journey! Record your first session.";
    }

    if (totalSessions < 5) {
      return "Great start! Keep practicing to see your progress.";
    }

    if (averageScore >= 90) {
      return "Outstanding! You're singing at an expert level!";
    }

    if (averageScore >= 75) {
      return "You're doing great! Keep up the consistent practice.";
    }

    return "Every practice session brings improvement. Keep going!";
  };


  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading statistics...</div>
      </div>
    );
  }

  const performance = getPerformanceLevel(stats.averageScore);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 Your Progress Dashboard</h2>
        <p className="motivational-message">{getMotivationalMessage()}</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        {/* Total Sessions */}
        <div className="stat-card">
          <div className="stat-icon">🎤</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalSessions}</div>
            <div className="stat-label">Total Sessions</div>
          </div>
        </div>

        {/* Average Score */}
        <div className="stat-card" style={{ borderColor: performance.color }}>
          <div className="stat-icon">{performance.emoji}</div>
          <div className="stat-content">
            <div className="stat-value" style={{ color: performance.color }}>
              {stats.averageScore}%
            </div>
            <div className="stat-label">Average Score</div>
            <div className="stat-sublabel" style={{ color: performance.color }}>
              {performance.level}
            </div>
          </div>
        </div>

        {/* Best Score */}
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-value">{stats.bestScore}%</div>
            <div className="stat-label">Best Score</div>
          </div>
        </div>

        {/* Practice Time */}
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalPracticeTime}</div>
            <div className="stat-label">Minutes Practiced</div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      {stats.recentProgress.length > 0 && (
        <div className="progress-section">
          <h3>Recent Progress</h3>
          <div className="progress-chart">
            {stats.recentProgress.map((point, index) => (
              <div key={index} className="chart-bar">
                <div
                  className="bar-fill"
                  style={{
                    height: `${point.score}%`,
                    backgroundColor: getPerformanceLevel(point.score).color
                  }}
                >
                  <span className="bar-value">{point.score}</span>
                </div>
                <div className="bar-label">{point.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="tips-section">
        <h3>💡 Quick Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-emoji">🎯</span>
            <p>Practice 10-15 minutes daily for best results</p>
          </div>
          <div className="tip-card">
            <span className="tip-emoji">💧</span>
            <p>Stay hydrated - water is a singer's best friend</p>
          </div>
          <div className="tip-card">
            <span className="tip-emoji">😊</span>
            <p>Warm up your voice before each session</p>
          </div>
          <div className="tip-card">
            <span className="tip-emoji">📈</span>
            <p>Track your progress and celebrate improvements</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
