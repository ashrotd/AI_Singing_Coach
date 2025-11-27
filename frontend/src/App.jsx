import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Test backend connection
    fetch('http://localhost:3001/api/health')
      .then(res => res.json())
      .then(data => {
        setHealth(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Backend connection failed:', err)
        setLoading(false)
      })
  }, [])

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
              <p>✅ {health.message}</p>
              <p className="timestamp">Last check: {new Date(health.timestamp).toLocaleTimeString()}</p>
            </div>
          ) : (
            <p>❌ Cannot connect to backend</p>
          )}
        </div>
      </header>
    </div>
  )
}

export default App
