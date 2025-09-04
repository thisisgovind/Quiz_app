// Quiz page: loads questions, handles selection, timing, navigation, and computes results
import { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

// Fisher–Yates shuffle for option randomization
const shuffle = (array) => {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function Quiz() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(30)
  const total = questions.length

  // Load local JSON questions and normalize to UI model
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await fetch('/questions.json', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load questions')
        const data = await res.json()
        const normalized = data.slice(0, 10).map((q, idx) => {
          const options = shuffle([q.correct, ...q.incorrect])
          return { id: idx + 1, question: q.question, correct: q.correct, options }
        })
        setQuestions(normalized)
        setCurrentIndex(0)
        setSelectedOption(null)
        setAnswers([])
      } catch (e) {
        setError('Could not load questions. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Progress bar percentage (currentIndex is 0-based)
  const progressPercent = useMemo(() => {
    if (!total) return 0
    return Math.round(((currentIndex) / total) * 100)
  }, [currentIndex, total])

  const current = questions[currentIndex]

  const onSelect = (opt) => {
    setSelectedOption(opt)
  }

  // Persist the current selection into answers; returns updated list
  const lockAnswer = useCallback((selection) => {
    if (selection == null) return { updated: answers }
    const updated = [...answers, { id: current.id, selected: selection, correct: current.correct }]
    setAnswers(updated)
    return { updated }
  }, [answers, current])

  const onNext = () => {
    if (selectedOption == null) return
    const { updated } = lockAnswer(selectedOption)
    if (currentIndex + 1 < total) {
      setCurrentIndex(currentIndex + 1)
      setSelectedOption(null)
      setTimeLeft(30)
    } else {
      const score = updated.reduce((s, a) => s + (a.selected === a.correct ? 1 : 0), 0)
      try {
        const best = Number(localStorage.getItem('highScore') || '0')
        if (score > best) localStorage.setItem('highScore', String(score))
      } catch {}
      navigate('/results', { state: { answers: updated, total, score, questions } })
    }
  }

  const onPrev = () => {
    if (currentIndex === 0) return
    const prevAnswers = answers.slice(0, -1)
    setAnswers(prevAnswers)
    setCurrentIndex(currentIndex - 1)
    setSelectedOption(prevAnswers[prevAnswers.length - 1]?.selected ?? null)
    setTimeLeft(30)
  }

  // Reset timer when question changes
  useEffect(() => {
    if (!current) return
    setTimeLeft(30)
  }, [current?.id])

  // Countdown + auto-advance when timer hits 0
  useEffect(() => {
    if (!current) return
    if (timeLeft <= 0) {
      const { updated } = lockAnswer(selectedOption)
      if (currentIndex + 1 < total) {
        setCurrentIndex(currentIndex + 1)
        setSelectedOption(null)
        setTimeLeft(30)
      } else {
        const score = updated.reduce((s, a) => s + (a.selected === a.correct ? 1 : 0), 0)
        try {
          const best = Number(localStorage.getItem('highScore') || '0')
          if (score > best) localStorage.setItem('highScore', String(score))
        } catch {}
        navigate('/results', { state: { answers: updated, total, score, questions } })
      }
      return
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, currentIndex, total, current, selectedOption, lockAnswer, navigate, questions])

  if (loading) return <div className="container">Loading questions…</div>
  if (error) return <div className="container">{error}</div>
  if (!current) return <div className="container">No questions available.</div>

  return (
    <div className="container" role="region" aria-label="Quiz">
      <div className="quiz-header">
        <div className="meta">Question {currentIndex + 1} of {total}</div>
        <div className="meta timer pill" aria-live="polite" aria-atomic="true">⏱ {String(timeLeft).padStart(2, '0')}s</div>
      </div>
      <div className="progress" aria-hidden>
        <div style={{ width: `${progressPercent}%` }} />
      </div>
      <div className="question" role="heading" aria-level={2}>{current.question}</div>
      <div className="options" role="list">
        {current.options.map((opt) => (
          <button
            key={opt}
            role="listitem"
            className={`option${selectedOption === opt ? ' selected' : ''}`}
            onClick={() => onSelect(opt)}
            aria-pressed={selectedOption === opt}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(opt) } }}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="controls">
        <button className="btn secondary" onClick={onPrev} disabled={currentIndex === 0} aria-label="Previous question">Previous</button>
        <button className="btn" onClick={onNext} disabled={selectedOption == null} aria-label={currentIndex + 1 === total ? 'Finish quiz' : 'Next question'}>{currentIndex + 1 === total ? 'Finish' : 'Next'}</button>
      </div>
    </div>
  )
}


