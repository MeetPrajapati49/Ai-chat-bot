import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div className="landing">
      <div className="landing-content">
        <h1>NeuraChat ⚡</h1>
        <p>Your personal AI assistant. Fast, smart, free.</p>
        <Link to="/chat" className="start-btn">
          Start Chatting →
        </Link>
      </div>
    </div>
  )
}

export default Landing