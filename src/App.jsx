// App shell: sets up routes and shared layout (header/footer)
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import Quiz from './pages/Quiz.jsx'
import Results from './pages/Results.jsx'

function App() {
  const location = useLocation()

  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" className="brand">Quiz App</Link>
        <nav className="nav">
          {location.pathname !== '/results' && (
            <Link to="/quiz" className="nav-link">Start</Link>
          )}
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Quiz />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </main>
      <footer className="app-footer">By Govind Kumar</footer>
    </div>
  )
}

export default App
