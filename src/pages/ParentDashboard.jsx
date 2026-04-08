import { useEffect, useState } from 'react'
import { SUBJECTS } from '../data/curriculum'
import { fetchAllSubmissions, fetchProgress, fetchExposuresBySubject, fetchSubmissionWithQuestions, updateSubmissionScore } from '../lib/db'

const CONFIDENCE_LABELS = { 1: '😟 Very unsure', 2: '😕 Unsure', 3: '😐 OK', 4: '🙂 Confident', 5: '😄 Very confident' }

export default function ParentDashboard() {
  const [submissions, setSubmissions] = useState([])
  const [progress, setProgress] = useState(null)
  const [exposures, setExposures] = useState({})
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')
  const [reviewId, setReviewId] = useState(null)
  const [reviewData, setReviewData] = useState(null)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [saGrades, setSaGrades] = useState({}) // { questionId: 'correct' | 'wrong' }
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const [s, p, e] = await Promise.all([fetchAllSubmissions(), fetchProgress(), fetchExposuresBySubject()])
      setSubmissions(s)
      setProgress(p)
      setExposures(e)
      setLoading(false)
    }
    load()
  }, [])

  async function openReview(submissionId) {
    setReviewId(submissionId)
    setReviewLoading(true)
    setSaGrades({})
    const data = await fetchSubmissionWithQuestions(submissionId)
    setReviewData(data)
    setReviewLoading(false)
  }

  function closeReview() {
    setReviewId(null)
    setReviewData(null)
    setSaGrades({})
  }

  async function saveGrades() {
    if (!reviewData) return
    setSaving(true)
    const { submission, questions } = reviewData

    // Count MC correct answers
    const mcCorrect = questions
      .filter(q => q.type === 'multiple_choice')
      .filter(q => submission.answers?.[q.id] === q.correct_index).length

    // Count SA answers marked correct by parent
    const saCorrect = Object.values(saGrades).filter(v => v === 'correct').length

    const newScore = mcCorrect + saCorrect

    const ok = await updateSubmissionScore(submission.id, newScore)
    if (ok) {
      // Update local state
      setSubmissions(prev => prev.map(s =>
        s.id === submission.id ? { ...s, score: newScore } : s
      ))
      setReviewData(prev => ({
        ...prev,
        submission: { ...prev.submission, score: newScore }
      }))
    }
    setSaving(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl animate-spin mb-3">⏳</div>
        <p className="text-purple-700 font-medium">Loading Ajith's progress…</p>
      </div>
    </div>
  )

  const totalAttempts = submissions.length
  const totalTime = Math.round(Object.values(progress?.timeBySubject ?? {}).reduce((a, b) => a + b, 0) / 60)
  const subjectsDone = new Set(submissions.map(s => s.subject_id)).size
  const totalQsSeen = Object.values(exposures).reduce((a, b) => a + b.seen, 0)

  const subjectSummary = SUBJECTS.map(subject => {
    const subs = submissions.filter(s => s.subject_id === subject.id)
    const mcSubs = subs.filter(s => s.mc_total > 0)
    const scores = mcSubs.map(s => ({ pct: Math.round((s.score / s.mc_total) * 100), attempt: s.attempt_number, date: s.submitted_at }))
    const exp = exposures[subject.id] ?? { seen: 0, total: 50 }
    const timeMin = Math.round((progress?.timeBySubject[subject.id] ?? 0) / 60)
    return { subject, subs, scores, exp, timeMin }
  })

  // ── FULL-PAGE TEST REVIEW ──────────────────────────────────────────────────
  if (reviewId) {
    if (reviewLoading) return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-4xl animate-spin">⏳</div>
      </div>
    )

    if (!reviewData) return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Could not load test data.</p>
          <button onClick={closeReview} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg">Back</button>
        </div>
      </div>
    )

    const { submission, questions } = reviewData
    const sub = SUBJECTS.find(x => x.id === submission.subject_id)
    const answers = submission.answers ?? {}
    const mcQs = questions.filter(q => q.type === 'multiple_choice')
    const saQs = questions.filter(q => q.type === 'short_answer')

    const mcCorrect = mcQs.filter(q => answers[q.id] === q.correct_index).length
    const saCorrect = Object.values(saGrades).filter(v => v === 'correct').length
    const saGraded = Object.keys(saGrades).length
    const currentScore = mcCorrect + saCorrect
    const maxPossible = mcQs.length + saQs.length
    const pct = maxPossible > 0 ? Math.round((currentScore / maxPossible) * 100) : 0
    const hasUngradedSA = saQs.some(q => answers[q.id]?.trim() && !saGrades[q.id])

    return (
      <div className="min-h-screen bg-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-purple-100 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={closeReview} className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium text-sm">
              ← Back
            </button>
            <div className="text-center">
              <span className="font-bold text-gray-800">{sub?.icon} {submission.subject_name}</span>
              <span className="text-gray-400 text-sm ml-2">Attempt #{submission.attempt_number}</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold" style={{ color: sub?.color }}>{currentScore}/{maxPossible} ({pct}%)</div>
              {submission.confidence_rating && (
                <div className="text-xs text-gray-400">{CONFIDENCE_LABELS[submission.confidence_rating]}</div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {/* SA grading notice */}
          {saQs.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-xl">📝</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800">Short answer grading</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  This test has {saQs.length} short answer question{saQs.length > 1 ? 's' : ''}. 
                  Mark each as correct or wrong below, then click Save Grades to update the score.
                  {saGraded > 0 && <span className="font-semibold"> ({saGraded}/{saQs.length} graded)</span>}
                </p>
              </div>
              <button
                onClick={saveGrades}
                disabled={saving || saGraded === 0}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40 transition"
                style={{ backgroundColor: sub?.color }}
              >
                {saving ? 'Saving…' : 'Save Grades'}
              </button>
            </div>
          )}

          {/* Questions */}
          {questions.map((q, idx) => {
            const isMC = q.type === 'multiple_choice'
            const userAnswer = answers[q.id]
            const mcCorrect = isMC ? userAnswer === q.correct_index : null
            const saGrade = saGrades[q.id]
            const hasAnswer = isMC ? userAnswer !== undefined : userAnswer?.trim()

            return (
              <div key={q.id} className={`bg-white rounded-2xl p-5 border-2 ${
                isMC
                  ? mcCorrect ? 'border-green-200' : hasAnswer ? 'border-red-200' : 'border-gray-100'
                  : saGrade === 'correct' ? 'border-green-200' : saGrade === 'wrong' ? 'border-red-200' : 'border-gray-100'
              }`}>
                {/* Question header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-gray-100 text-xs font-bold text-gray-500 flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        q.difficulty === 'foundation' ? 'bg-green-100 text-green-700' :
                        q.difficulty === 'core' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'}`}>
                        {q.difficulty}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">{q.topic}</span>
                    </div>
                  </div>
                  <span className="text-lg flex-shrink-0">
                    {isMC
                      ? mcCorrect ? '✅' : hasAnswer ? '❌' : '⬜'
                      : saGrade === 'correct' ? '✅' : saGrade === 'wrong' ? '❌' : '⬜'}
                  </span>
                </div>

                {/* Question text */}
                <p className="font-medium text-gray-800 mb-4">{q.question}</p>

                {/* MC options */}
                {isMC && (
                  <div className="space-y-2 mb-3">
                    {q.options.map((opt, i) => {
                      const isCorrectOpt = i === q.correct_index
                      const isChosen = i === userAnswer
                      let cls = 'w-full text-left px-3 py-2.5 rounded-xl text-sm border-2 '
                      if (isCorrectOpt) cls += 'border-green-400 bg-green-50 text-green-800 font-medium'
                      else if (isChosen && !isCorrectOpt) cls += 'border-red-300 bg-red-50 text-red-700'
                      else cls += 'border-gray-100 text-gray-400'
                      return (
                        <div key={i} className={cls}>
                          <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                          {opt}
                          {isCorrectOpt && <span className="ml-2 text-green-600">✓ Correct answer</span>}
                          {isChosen && !isCorrectOpt && <span className="ml-2 text-red-500">✗ Ajith's answer</span>}
                          {isChosen && isCorrectOpt && <span className="ml-2 text-green-600"> ← Ajith chose this</span>}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* MC explanation */}
                {isMC && q.explanation && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                    <span className="font-semibold">Explanation: </span>{q.explanation}
                  </div>
                )}

                {/* Short answer */}
                {!isMC && (
                  <div className="space-y-3">
                    {/* Ajith's answer */}
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 mb-1">Ajith's answer</p>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {userAnswer?.trim() || <span className="italic text-gray-400">No answer given</span>}
                      </p>
                    </div>

                    {/* Key points */}
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-xs font-semibold text-blue-700 mb-1">Key points to look for</p>
                      <p className="text-xs text-blue-700">{q.placeholder}</p>
                    </div>

                    {/* Grade buttons */}
                    {userAnswer?.trim() && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSaGrades(prev => ({ ...prev, [q.id]: 'correct' }))}
                          className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition ${
                            saGrade === 'correct'
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'bg-white border-green-300 text-green-700 hover:bg-green-50'
                          }`}
                        >
                          ✓ Mark correct
                        </button>
                        <button
                          onClick={() => setSaGrades(prev => ({ ...prev, [q.id]: 'wrong' }))}
                          className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition ${
                            saGrade === 'wrong'
                              ? 'bg-red-500 border-red-500 text-white'
                              : 'bg-white border-red-300 text-red-700 hover:bg-red-50'
                          }`}
                        >
                          ✗ Mark wrong
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* Save button at bottom too */}
          {saQs.length > 0 && (
            <button
              onClick={saveGrades}
              disabled={saving || saGraded === 0}
              className="w-full py-3 rounded-xl text-white font-bold text-base disabled:opacity-40 transition"
              style={{ backgroundColor: sub?.color }}
            >
              {saving ? 'Saving…' : `Save Grades (${saGraded}/${saQs.length} short answers graded)`}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── MAIN DASHBOARD ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👨‍👩‍👦</span>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">Ajith's Parent Dashboard</h1>
              <p className="text-sm text-gray-500">Year 7 Easter Revision — Brentwood School</p>
            </div>
          </div>
          <a href="/" className="text-sm text-purple-600 hover:underline">← Student view</a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Tests completed', value: totalAttempts, icon: '📝', color: '#7C3AED' },
            { label: 'Minutes studied', value: totalTime, icon: '⏱️', color: '#059669' },
            { label: 'Subjects tried', value: subjectsDone, icon: '📚', color: '#2563EB' },
            { label: 'Questions seen', value: totalQsSeen, icon: '👁️', color: '#D97706' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { key: 'overview', label: '📊 Overview' },
            { key: 'tests', label: '📋 All Tests' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t.key ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-purple-50'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="space-y-3">
            {subjectSummary.map(({ subject, subs, scores, exp, timeMin }) => (
              <div key={subject.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">{subject.icon}</span>
                  <span className="font-semibold text-gray-800">{subject.name}</span>
                  <div className="ml-auto flex items-center gap-4 text-xs text-gray-500">
                    <span>⏱️ {timeMin} min</span>
                    <span>📝 {subs.length} test{subs.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                {scores.length > 0 ? (
                  <div className="flex gap-1 mb-2 items-end h-10">
                    {scores.slice(-10).map((s, i) => (
                      <div key={i} className="flex-1 rounded-t relative group" style={{ height: `${s.pct}%`, minHeight: 4, backgroundColor: subject.color }}>
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 whitespace-nowrap">{s.pct}%</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-10 flex items-center text-xs text-gray-400">Not attempted yet</div>
                )}
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                  <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100, (exp.seen / Math.max(exp.total, 1)) * 100)}%`, backgroundColor: subject.color }} />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{exp.seen} of {exp.total} questions seen</span>
                  {scores.length > 0 && (
                    <span>Best: <strong style={{ color: subject.color }}>{Math.max(...scores.map(s => s.pct))}%</strong> · Latest: <strong>{scores[scores.length - 1].pct}%</strong></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ALL TESTS TAB */}
        {tab === 'tests' && (
          <div className="space-y-3">
            {submissions.length === 0 && <p className="text-gray-400 text-center py-10">No tests completed yet</p>}
            {submissions.map(s => {
              const sub = SUBJECTS.find(x => x.id === s.subject_id)
              const pct = s.mc_total > 0 ? Math.round((s.score / s.mc_total) * 100) : null
              return (
                <div key={s.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                  <span className="text-2xl">{sub?.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{s.subject_name}</div>
                    <div className="text-xs text-gray-400">
                      Attempt #{s.attempt_number} · {new Date(s.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      {s.confidence_rating && <span className="ml-2">{CONFIDENCE_LABELS[s.confidence_rating]}</span>}
                    </div>
                  </div>
                  {pct !== null && (
                    <div className="text-right mr-3">
                      <div className="text-xl font-bold" style={{ color: sub?.color }}>{pct}%</div>
                      <div className="text-xs text-gray-400">{s.score}/{s.mc_total}</div>
                    </div>
                  )}
                  <button
                    onClick={() => openReview(s.id)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition flex-shrink-0"
                    style={{ backgroundColor: sub?.color }}
                  >
                    Review →
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
