import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getSubject } from '../data/curriculum'
import { fetchSubmission, saveSubmission } from '../lib/db'

export default function AssignmentPage() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const subject = getSubject(subjectId)
  const [answers, setAnswers] = useState({})
  const [confidence, setConfidence] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [prevSubmission, setPrevSubmission] = useState(null)
  const [saving, setSaving] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)

  useEffect(() => {
    if (!subject) return
    fetchSubmission(subjectId).then(sub => {
      if (sub) {
        setPrevSubmission(sub)
        setAnswers(sub.answers ?? {})
        setConfidence(sub.confidence_rating)
        setSubmitted(true)
      }
    })
  }, [subjectId, subject])

  if (!subject) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Subject not found.</p>
        <Link to="/" className="btn-primary mt-4 inline-block">Back to dashboard</Link>
      </div>
    )
  }

  const questions = subject.assignment.questions
  const q = questions[currentQ]
  const totalQ = questions.length
  const progress = Math.round(((currentQ + 1) / totalQ) * 100)

  const setMCAnswer = (qId, idx) => setAnswers(a => ({ ...a, [qId]: idx }))
  const setTextAnswer = (qId, val) => setAnswers(a => ({ ...a, [qId]: val }))

  const allAnswered = questions.every(q => {
    const a = answers[q.id]
    return a !== undefined && a !== null && a !== ''
  })

  const handleSubmit = async () => {
    setSaving(true)
    const ok = await saveSubmission({
      subjectId,
      assignmentId: subject.assignment.id,
      answers,
      confidenceRating: confidence,
    })
    setSaving(false)
    if (ok) setSubmitted(true)
  }

  // ── Submitted view ──────────────────────────────────────────────────────
  if (submitted) {
    const mcQuestions = questions.filter(q => q.type === 'multiple_choice')
    const correct = mcQuestions.filter(q => answers[q.id] === q.correct_index).length

    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(`/subject/${subjectId}`)} className="btn-secondary text-xs">
            ← Back to {subject.name}
          </button>
        </div>

        {/* Summary card */}
        <div className="card mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: subject.bgColor }}
            >
              {subject.icon}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{subject.name} — Assignment complete</h1>
              <p className="text-sm text-gray-400">
                Submitted {prevSubmission ? new Date(prevSubmission.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) : 'just now'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-semibold text-gray-900">{correct}/{mcQuestions.length}</div>
              <div className="text-xs text-gray-500 mt-1">Multiple choice correct</div>
            </div>
            <div className="bg-gray-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-semibold text-gray-900">{questions.filter(q => q.type === 'short_answer').length}</div>
              <div className="text-xs text-gray-500 mt-1">Written answers</div>
            </div>
            <div className="bg-gray-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-semibold text-gray-900">{confidence ?? '—'}/5</div>
              <div className="text-xs text-gray-500 mt-1">Confidence rating</div>
            </div>
          </div>
        </div>

        {/* Review all answers */}
        <h2 className="text-sm font-medium text-gray-700 mb-3">Your answers</h2>
        <div className="space-y-4">
          {questions.map((q, i) => {
            const ans = answers[q.id]
            const isCorrect = q.type === 'multiple_choice' && ans === q.correct_index
            const isWrong = q.type === 'multiple_choice' && ans !== q.correct_index

            return (
              <div key={q.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs font-medium text-gray-400">
                    Question {i + 1} · {q.type === 'multiple_choice' ? 'Multiple choice' : 'Written answer'}
                  </p>
                  {q.type === 'multiple_choice' && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-800 mb-3">{q.question}</p>
                {q.extract && (
                  <blockquote className="text-sm text-gray-500 italic border-l-2 border-gray-200 pl-3 mb-3">
                    {q.extract}
                  </blockquote>
                )}
                {q.type === 'multiple_choice' ? (
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => {
                      const isYours = ans === oi
                      const isRight = oi === q.correct_index
                      let cls = 'border border-gray-200 text-gray-600'
                      if (isRight) cls = 'border border-green-300 bg-green-50 text-green-800'
                      else if (isYours && !isRight) cls = 'border border-red-300 bg-red-50 text-red-800'
                      return (
                        <div key={oi} className={`text-sm px-3 py-2 rounded-lg ${cls}`}>
                          {isYours && '→ '}{opt}
                          {isRight && ' ✓'}
                        </div>
                      )
                    })}
                    {q.explanation && (
                      <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                        <span className="font-medium">Explanation: </span>{q.explanation}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">
                    {ans || <span className="text-gray-400 italic">No answer provided</span>}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={() => setSubmitted(false)} className="btn-secondary">
            Edit answers
          </button>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to dashboard
          </button>
        </div>
      </div>
    )
  }

  // ── Active assignment ────────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(`/subject/${subjectId}`)} className="btn-secondary text-xs">
          ← Back to {subject.name}
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">{subject.assignment.title}</h1>
          <p className="text-xs text-gray-400">{totalQ} questions · {subject.name}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <div className="progress-bar flex-1">
          <div className="progress-fill" style={{ width: `${progress}%`, background: subject.color }} />
        </div>
        <span className="text-xs text-gray-400">Q{currentQ + 1} of {totalQ}</span>
      </div>

      {/* Question card */}
      <div className="card mb-4">
        <p className="text-xs font-medium text-gray-400 mb-2">
          Question {currentQ + 1} · {q.type === 'multiple_choice' ? 'Multiple choice' : 'Written answer'}
        </p>
        <p className="text-base text-gray-900 mb-4 leading-relaxed">{q.question}</p>
        {q.extract && (
          <blockquote className="text-sm text-gray-600 italic border-l-2 border-gray-300 pl-3 mb-4">
            {q.extract}
          </blockquote>
        )}

        {q.type === 'multiple_choice' ? (
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const selected = answers[q.id] === oi
              return (
                <button
                  key={oi}
                  onClick={() => setMCAnswer(q.id, oi)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                    selected
                      ? 'border-blue-400 bg-blue-50 text-blue-900 font-medium'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2 text-gray-400 font-mono text-xs">
                    {['A', 'B', 'C', 'D'][oi]}.
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
        ) : (
          <textarea
            className="w-full min-h-32 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 resize-y focus:outline-none focus:border-gray-400"
            placeholder={q.placeholder}
            value={answers[q.id] ?? ''}
            onChange={e => setTextAnswer(q.id, e.target.value)}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setCurrentQ(i => i - 1)}
          disabled={currentQ === 0}
          className="btn-secondary disabled:opacity-30"
        >
          ← Previous
        </button>
        <div className="flex gap-1.5">
          {questions.map((_, i) => {
            const answered = answers[questions[i].id] !== undefined && answers[questions[i].id] !== ''
            return (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-7 h-7 rounded-full text-xs transition-colors ${
                  i === currentQ
                    ? 'text-white font-medium'
                    : answered
                    ? 'bg-gray-200 text-gray-600'
                    : 'border border-gray-200 text-gray-400'
                }`}
                style={i === currentQ ? { background: subject.color } : {}}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
        {currentQ < totalQ - 1 ? (
          <button onClick={() => setCurrentQ(i => i + 1)} className="btn-primary">
            Next →
          </button>
        ) : (
          <button
            onClick={() => setCurrentQ(totalQ)} // go to submit section
            className="btn-primary"
          >
            Review & submit →
          </button>
        )}
      </div>

      {/* Confidence + Submit (show when on last question or after navigating all) */}
      {currentQ === totalQ - 1 && (
        <div className="card mt-2">
          <h3 className="text-sm font-medium text-gray-800 mb-1">How confident do you feel about {subject.name}?</h3>
          <p className="text-xs text-gray-400 mb-4">Be honest — this helps track your progress.</p>
          <div className="flex gap-3 mb-6">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setConfidence(n)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  confidence === n
                    ? 'border-amber-400 bg-amber-50 text-amber-800'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mb-6">
            <span>Not confident</span>
            <span>Very confident</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {allAnswered ? 'All questions answered.' : 'Some questions are unanswered.'}
              {' '}Your answers save to your revision record.
            </p>
            <button
              onClick={handleSubmit}
              disabled={!confidence || saving}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Submit assignment →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
