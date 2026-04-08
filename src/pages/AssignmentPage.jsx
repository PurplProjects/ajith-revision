import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSubject } from '../data/curriculum'
import {
  seedQuestionsIfNeeded, selectQuestionsForTest, logQuestionExposures,
  saveSubmission, getNextAttemptNumber, fetchSubjectSubmissions
} from '../lib/db'

const CONFIDENCE_LABELS = { 1: '😟 Very unsure', 2: '😕 Unsure', 3: '😐 OK', 4: '🙂 Confident', 5: '😄 Very confident' }

export default function AssignmentPage() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const subject = getSubject(subjectId)

  const [phase, setPhase] = useState('loading')
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [revealed, setRevealed] = useState(false)
  const [confidence, setConfidence] = useState(3)
  const [attemptNum, setAttemptNum] = useState(1)
  const [history, setHistory] = useState([])
  const [score, setScore] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!subject) return
    async function load() {
      try {
        await seedQuestionsIfNeeded()
        const [qs, n, hist] = await Promise.all([
          selectQuestionsForTest(subjectId),
          getNextAttemptNumber(subjectId),
          fetchSubjectSubmissions(subjectId),
        ])
        if (!qs || qs.length === 0) {
          setError('No questions found for this subject. Please go back to the home page first to initialise the question bank.')
          setPhase('error')
          return
        }
        setQuestions(qs)
        setAttemptNum(n)
        setHistory(hist)
        await logQuestionExposures(qs.map(q => q.id))
        setPhase('intro')
      } catch (e) {
        console.error(e)
        setError('Something went wrong loading the test. Please check your Supabase connection.')
        setPhase('error')
      }
    }
    load()
  }, [subjectId])

  if (!subject) return (
    <div className="text-center py-20 text-gray-500">Subject not found</div>
  )

  if (phase === 'loading') return (
    <div className="flex flex-col items-center py-20 gap-3">
      <div className="text-3xl animate-spin">⚙️</div>
      <p className="text-gray-500">Selecting your questions…</p>
    </div>
  )

  if (phase === 'error') return (
    <div className="max-w-xl mx-auto text-center py-16">
      <div className="text-5xl mb-4">⚠️</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Couldn't load test</h2>
      <p className="text-gray-500 mb-6 text-sm">{error}</p>
      <button onClick={() => navigate('/')} className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:opacity-90">
        Go to Home
      </button>
    </div>
  )

  if (phase === 'intro') return (
    <div className="max-w-xl mx-auto text-center py-10">
      <div className="text-5xl mb-4">{subject.icon}</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{subject.name} Test</h1>
      <p className="text-gray-500 mb-2">Attempt #{attemptNum}</p>
      <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-600 space-y-1">
        <p>📋 {questions.length} questions — mix of multiple choice and short answer</p>
        <p>⚡ Questions selected based on what you've seen least</p>
        <p>✅ Instant feedback after each answer</p>
      </div>
      {history.length > 0 && (
        <div className="mb-6 text-sm text-gray-400">
          Previous best: {Math.max(...history.filter(h => h.mc_total > 0).map(h => Math.round((h.score / h.mc_total) * 100)))}%
        </div>
      )}
      <button
        onClick={() => setPhase('test')}
        className="px-8 py-3 rounded-xl font-bold text-white text-lg hover:opacity-90"
        style={{ backgroundColor: subject.color }}
      >
        Begin →
      </button>
    </div>
  )

  if (phase === 'test') {
    const q = questions[current]
    if (!q) return null
    const isLastQ = current === questions.length - 1
    const isMC = q.type === 'multiple_choice'
    const userAnswer = answers[q.id]
    const isCorrect = isMC && userAnswer !== undefined && userAnswer === q.correct_index

    function handleMCAnswer(idx) {
      if (revealed) return
      setAnswers(prev => ({ ...prev, [q.id]: idx }))
      setRevealed(true)
    }

    async function handleNext() {
      setRevealed(false)
      if (isLastQ) {
        const mcQs = questions.filter(q => q.type === 'multiple_choice')
        const mcScore = mcQs.filter(q => answers[q.id] === q.correct_index).length
        setScore({ correct: mcScore, total: mcQs.length })
        await saveSubmission({
          subjectId,
          subjectName: subject.name,
          attemptNumber: attemptNum,
          questionsShown: questions.map(q => q.id),
          answers,
          score: mcScore,
          mcTotal: mcQs.length,
          confidenceRating: confidence,
        })
        setPhase('results')
      } else {
        setCurrent(c => c + 1)
      }
    }

    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(`/subject/${subjectId}`)} className="text-gray-400 hover:text-gray-600">←</button>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{subject.name} — Question {current + 1} of {questions.length}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                q.difficulty === 'foundation' ? 'bg-green-100 text-green-700' :
                q.difficulty === 'core' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'}`}>
                {q.difficulty}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="h-1.5 rounded-full bg-indigo-500 transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-xs text-gray-400 mb-3 block">{q.topic}</span>

          {q.extract && (
            <blockquote className="border-l-4 border-indigo-200 pl-4 mb-4 text-sm text-gray-600 italic">
              {q.extract}
            </blockquote>
          )}

          <h2 className="text-lg font-semibold text-gray-800 mb-5">{q.question}</h2>

          {isMC && (
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                let cls = 'w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition '
                if (!revealed) {
                  cls += 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer'
                } else if (i === q.correct_index) {
                  cls += 'border-green-400 bg-green-50 text-green-800'
                } else if (i === userAnswer && i !== q.correct_index) {
                  cls += 'border-red-300 bg-red-50 text-red-700'
                } else {
                  cls += 'border-gray-100 text-gray-400'
                }
                return (
                  <button key={i} className={cls} onClick={() => handleMCAnswer(i)}>
                    <span className="mr-2 font-bold">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                    {revealed && i === q.correct_index && <span className="ml-2">✓</span>}
                    {revealed && i === userAnswer && i !== q.correct_index && <span className="ml-2">✗</span>}
                  </button>
                )
              })}
            </div>
          )}

          {!isMC && (
            <div>
              <textarea
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none resize-none"
                rows={4}
                placeholder={q.placeholder || 'Write your answer here…'}
                disabled={revealed}
                onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                value={answers[q.id] || ''}
              />
              {!revealed && (
                <button
                  onClick={() => setRevealed(true)}
                  disabled={!answers[q.id]?.trim()}
                  className="mt-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-40 transition"
                  style={{ backgroundColor: subject.color }}
                >
                  Submit answer
                </button>
              )}
            </div>
          )}

          {revealed && isMC && (
            <div className={`mt-4 p-4 rounded-xl text-sm ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
              <p className="font-semibold mb-1">{isCorrect ? '✅ Correct!' : '❌ Not quite'}</p>
              <p className="text-gray-700">{q.explanation}</p>
            </div>
          )}

          {revealed && !isMC && (
            <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 text-sm">
              <p className="font-semibold text-blue-800 mb-1">📝 Check your answer</p>
              <p className="text-blue-700 text-xs">{q.placeholder}</p>
            </div>
          )}

          {revealed && (
            <div className="mt-4 flex justify-end">
              {isLastQ ? (
                <div className="flex flex-col items-end gap-3 w-full">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>How confident do you feel?</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(n => (
                        <button key={n} onClick={() => setConfidence(n)}
                          className={`w-8 h-8 rounded-full text-xs font-bold transition ${confidence === n ? 'ring-2 ring-indigo-500' : ''}`}
                          style={{ backgroundColor: n === confidence ? subject.color + '33' : '#f3f4f6', color: subject.color }}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 rounded-xl text-white font-semibold text-sm hover:opacity-90"
                    style={{ backgroundColor: subject.color }}
                  >
                    See Results →
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 rounded-xl text-white font-semibold text-sm hover:opacity-90"
                  style={{ backgroundColor: subject.color }}
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (phase === 'results' && score !== null) {
    const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : pct >= 40 ? '💪' : '📚'
    const saCount = questions.filter(q => q.type === 'short_answer').length

    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center mb-4">
          <div className="text-6xl mb-3">{emoji}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Test Complete!</h2>
          <p className="text-gray-500 mb-4">Attempt #{attemptNum}</p>
          <div className="text-5xl font-bold mb-1" style={{ color: subject.color }}>{pct}%</div>
          <p className="text-gray-500 text-sm mb-2">{score.correct} / {score.total} multiple choice correct</p>
          {saCount > 0 && <p className="text-gray-400 text-xs mb-4">+ {saCount} short answer question{saCount > 1 ? 's' : ''} — mark yourself honestly</p>}
          <p className="text-sm text-gray-600">Confidence: {CONFIDENCE_LABELS[confidence]}</p>
        </div>

        <div className="space-y-3 mb-4">
          <h3 className="font-semibold text-gray-700 text-sm px-1">Question review</h3>
          {questions.map((q) => {
            const isMC = q.type === 'multiple_choice'
            const userAns = answers[q.id]
            const correct = isMC ? userAns === q.correct_index : null
            return (
              <div key={q.id} className={`bg-white rounded-xl p-4 border text-sm ${
                !isMC ? 'border-blue-100' : correct ? 'border-green-100' : 'border-red-100'
              }`}>
                <div className="flex items-start gap-2">
                  <span>{!isMC ? '📝' : correct ? '✅' : '❌'}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{q.question}</p>
                    {isMC && (
                      <>
                        {!correct && <p className="text-red-600 text-xs mt-1">Your answer: {q.options[userAns] ?? 'Not answered'}</p>}
                        <p className="text-green-600 text-xs mt-1">Correct: {q.options[q.correct_index]}</p>
                        <p className="text-gray-500 text-xs mt-1">{q.explanation}</p>
                      </>
                    )}
                    {!isMC && (
                      <>
                        <p className="text-gray-600 text-xs mt-1"><span className="font-medium">Your answer: </span>{answers[q.id] || '(no answer)'}</p>
                        <p className="text-blue-600 text-xs mt-1"><span className="font-medium">Key points: </span>{q.placeholder}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3">
          <button onClick={() => navigate('/')} className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:bg-gray-50">
            Home
          </button>
          <button
            onClick={() => navigate(`/subject/${subjectId}/test`)}
            className="flex-1 py-3 rounded-xl font-semibold text-white hover:opacity-90"
            style={{ backgroundColor: subject.color }}
          >
            Try Again →
          </button>
        </div>
      </div>
    )
  }

  return null
}
