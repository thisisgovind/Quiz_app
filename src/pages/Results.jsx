// Results page: displays score, per-question correctness, and restart action
import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state

  useEffect(() => {
    if (!state) navigate('/quiz', { replace: true })
  }, [state, navigate])

  if (!state) return null
  const { answers, total, score, questions } = state

  return (
    <div className="container">
      <h2>Your Score: {score}/{total}</h2>
      <div className="meta">Best: {(() => { try { return localStorage.getItem('highScore') || '0' } catch { return '0' } })()}/{total}</div>
      <div className="result" role="list">
        {answers.map((a, idx) => {
          const q = questions[idx]
          const isCorrect = a.selected === a.correct
          return (
            <div key={q.id} className="answer row" role="listitem">
              <div className="title">Q{idx + 1}. {q.question}</div>
              <div className={`badge ${isCorrect ? 'success' : 'error'}`}>{isCorrect ? 'Correct' : 'Incorrect'}</div>
              <div className="meta">Your answer: {a.selected}</div>
              {!isCorrect && <div className="meta">Correct answer: {q.correct}</div>}
            </div>
          )
        })}
      </div>
      <div className="controls">
        <Link className="btn" to="/quiz" replace>Restart Quiz</Link>
      </div>
    </div>
  )
}


