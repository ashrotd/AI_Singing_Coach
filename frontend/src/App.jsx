import { useState, useEffect } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import SessionList from './components/SessionList'
import AudioRecorder from './components/AudioRecorder'
import { checkHealth } from './services/api'

function App() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showSessions, setShowSessions] = useState(false)
  const [refreshSessions, setRefreshSessions] = useState(0)

  useEffect(() => {
    // Test backend connection
    checkBackendHealth()
  }, [])

  const checkBackendHealth = async () => {
    try {
      const data = await checkHealth()
      setHealth(data)
      setLoading(false)
      // Auto-show sessions if backend is healthy
      setShowSessions(true)
    } catch (err) {
      console.error('Backend connection failed:', err)
      setLoading(false)
    }
  }

  // Handle new session created from AudioRecorder
  const handleSessionCreated = () => {
    // Trigger refresh of session list
    setRefreshSessions(prev => prev + 1)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎤 AI Singing Coach</h1>
        <p>Learn to sing better with AI-powered feedback</p>

        <div className="status-card">
          <h3>Backend Status:</h3>
          {loading ? (
            <p>Checking connection...</p>
          ) : health ? (
            <div>
              <p> {health.message}</p>
              <p className="timestamp">Last check: {new Date(health.timestamp).toLocaleTimeString()}</p>
            </div>
          ) : (
            <p>Cannot connect to backend</p>
          )}
        </div>
      </header>

      <main className="App-main">
        {showSessions && (
          <>
            <Dashboard key={refreshSessions} />
            <AudioRecorder onSessionCreated={handleSessionCreated} />
            <SessionList key={refreshSessions} />
          </>
        )}
      </main>
    </div>
  )
}

export default App
