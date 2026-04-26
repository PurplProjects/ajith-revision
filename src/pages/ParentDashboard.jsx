import { useEffect, useState } from 'react'
import { SUBJECTS } from '../data/curriculum'
import {
  fetchAllSubmissions, fetchProgress, fetchExposuresBySubject,
  fetchSubmissionWithQuestions, updateSubmissionScore,
  fetchStudentGrades, fetchStudentTeachers, fetchRevisionStats
} from '../lib/db'

const CONFIDENCE_LABELS = { 1: '😟 Very unsure', 2: '😕 Unsure', 3: '😐 OK', 4: '🙂 Confident', 5: '😄 Very confident' }
const TERMS = [
  { key: 'michaelmas-2025', label: 'Dec 2025' },
  { key: 'lent-2026',       label: 'Jan 2026' },
  { key: 'trinity-2026',    label: 'Apr 2026' },
]

function gradeColor(grade) {
  if (!grade) return '#d1d5db'
  if (grade >= 8) return '#1D9E75'
  if (grade === 7) return '#378ADD'
  if (grade === 6) return '#BA7517'
  return '#D85A30'
}

function GradePill({ grade }) {
  if (!grade) return <span className="text-gray-300 text-sm">—</span>
  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-black shadow-sm"
      style={{ backgroundColor: gradeColor(grade) }}
    >
      {grade}
    </span>
  )
}

function TrendBadge({ from, to }) {
  if (!from || !to) return null
  const diff = to - from
  if (diff === 0) return <span className="text-xs text-gray-400">→</span>
  return (
    <span className="text-xs font-bold" style={{ color: diff > 0 ? '#1D9E75' : '#D85A30' }}>
      {diff > 0 ? `+${diff} ▲` : `${diff} ▼`}
    </span>
  )
}

export default function ParentDashboard() {
  const [submissions, setSubmissions] = useState([])
  const [progress, setProgress] = useState(null)
  const [exposures, setExposures] = useState({})
  const [grades, setGrades] = useState({})     // { subjectId: { term: { grade, comment } } }
  const [revisionStats, setRevisionStats] = useState({})
  const [teachers, setTeachers] = useState({}) // { subjectId: { name, email } }
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('grades')
  const [reviewId, setReviewId] = useState(null)
  const [reviewData, setReviewData] = useState(null)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [saGrades, setSaGrades] = useState({})
  const [saving, setSaving] = useState(false)
  const [expandedGrade, setExpandedGrade] = useState(null) // subjectId for comment expansion

  useEffect(() => {
    async function load() {
      const [s, p, e, g, t, rs] = await Promise.all([
        fetchAllSubmissions(),
        fetchProgress(),
        fetchExposuresBySubject(),
        fetchStudentGrades(),
        fetchStudentTeachers(),
        fetchRevisionStats(),
      ])
      setSubmissions(s)
      setProgress(p)
      setExposures(e)
      setTeachers(t)

      // Index grades: { subjectId: { term: { grade, teacher_comment } } }
      const gradeMap = {}
      for (const row of g) {
        if (!gradeMap[row.subject_id]) gradeMap[row.subject_id] = {}
        gradeMap[row.subject_id][row.term] = { grade: row.grade, comment: row.teacher_comment }
      }
      setGrades(gradeMap)
      setRevisionStats(rs)
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
    const mcCorrect = questions.filter(q => q.type === 'multiple_choice').filter(q => submission.answers?.[q.id] === q.correct_index).length
    const saCorrect = Object.values(saGrades).filter(v => v === 'correct').length
    const newScore = mcCorrect + saCorrect
    const newTotal = questions.length
    const ok = await updateSubmissionScore(submission.id, newScore, newTotal)
    if (ok) {
      setSubmissions(prev => prev.map(s => s.id === submission.id ? { ...s, score: newScore, mc_total: newTotal } : s))
      setReviewId(null)
      setReviewData(null)
      setSaGrades({})
      setTab('tests')
    }
    setSaving(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center">
      <div className="text-center"><div className="text-4xl animate-spin mb-3">⏳</div>
        <p className="text-purple-700 font-medium">Loading Ajith's progress…</p>
      </div>
    </div>
  )

  const totalAttempts = submissions.length
  const totalTime = Math.round(Object.values(progress?.timeBySubject ?? {}).reduce((a, b) => a + b, 0) / 60)
  const subjectsDone = new Set(submissions.map(s => s.subject_id)).size
  const totalQsSeen = Object.values(exposures).reduce((a, b) => a + b.seen, 0)

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

    return (
      <div className="min-h-screen bg-purple-50">
        <div className="bg-white shadow-sm border-b border-purple-100 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={closeReview} className="text-purple-600 hover:text-purple-800 font-medium text-sm">← Back</button>
            <div className="text-center">
              <span className="font-bold text-gray-800">{sub?.icon} {submission.subject_name}</span>
              <span className="text-gray-400 text-sm ml-2">Attempt #{submission.attempt_number}</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold" style={{ color: sub?.color }}>{currentScore}/{maxPossible} ({pct}%)</div>
              {submission.confidence_rating && <div className="text-xs text-gray-400">{CONFIDENCE_LABELS[submission.confidence_rating]}</div>}
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {saQs.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-xl">📝</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800">Short answer grading</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  {saQs.length} short answer question{saQs.length > 1 ? 's' : ''}. Mark each then click Save Grades.
                  {saGraded > 0 && <span className="font-semibold"> ({saGraded}/{saQs.length} graded)</span>}
                </p>
              </div>
              <button onClick={saveGrades} disabled={saving || saGraded === 0}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40"
                style={{ backgroundColor: sub?.color }}>
                {saving ? 'Saving…' : 'Save Grades'}
              </button>
            </div>
          )}
          {questions.map((q, idx) => {
            const isMC = q.type === 'multiple_choice'
            const userAnswer = answers[q.id]
            const mcCorrectQ = isMC ? userAnswer === q.correct_index : null
            const saGrade = saGrades[q.id]
            const hasAnswer = isMC ? userAnswer !== undefined : userAnswer?.trim()
            return (
              <div key={q.id} className={`bg-white rounded-2xl p-5 border-2 ${
                isMC ? mcCorrectQ ? 'border-green-200' : hasAnswer ? 'border-red-200' : 'border-gray-100'
                : saGrade === 'correct' ? 'border-green-200' : saGrade === 'wrong' ? 'border-red-200' : 'border-gray-100'}`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-gray-100 text-xs font-bold text-gray-500 flex items-center justify-center flex-shrink-0">{idx + 1}</span>
                    <div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${q.difficulty === 'foundation' ? 'bg-green-100 text-green-700' : q.difficulty === 'core' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{q.difficulty}</span>
                      <span className="text-xs text-gray-400 ml-2">{q.topic}</span>
                    </div>
                  </div>
                  <span className="text-lg flex-shrink-0">{isMC ? mcCorrectQ ? '✅' : hasAnswer ? '❌' : '⬜' : saGrade === 'correct' ? '✅' : saGrade === 'wrong' ? '❌' : '⬜'}</span>
                </div>
                <p className="font-medium text-gray-800 mb-4">{q.question}</p>
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
                          <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                          {isCorrectOpt && !isChosen && <span className="ml-2 text-green-600">✓ Correct answer</span>}
                          {isChosen && !isCorrectOpt && <span className="ml-2 text-red-500">✗ Ajith's answer</span>}
                          {isChosen && isCorrectOpt && <span className="ml-2 text-green-600"> ← Ajith chose this ✓</span>}
                        </div>
                      )
                    })}
                  </div>
                )}
                {isMC && q.explanation && <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600"><span className="font-semibold">Explanation: </span>{q.explanation}</div>}
                {!isMC && (
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 mb-1">Ajith's answer</p>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{userAnswer?.trim() || <span className="italic text-gray-400">No answer given</span>}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-xs font-semibold text-blue-700 mb-1">Key points to look for</p>
                      <p className="text-xs text-blue-700">{q.placeholder}</p>
                    </div>
                    {userAnswer?.trim() && (
                      <div className="flex gap-2">
                        <button onClick={() => setSaGrades(prev => ({ ...prev, [q.id]: 'correct' }))}
                          className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition ${saGrade === 'correct' ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-green-300 text-green-700 hover:bg-green-50'}`}>
                          ✓ Mark correct
                        </button>
                        <button onClick={() => setSaGrades(prev => ({ ...prev, [q.id]: 'wrong' }))}
                          className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition ${saGrade === 'wrong' ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-red-300 text-red-700 hover:bg-red-50'}`}>
                          ✗ Mark wrong
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
          {saQs.length > 0 && (
            <button onClick={saveGrades} disabled={saving || saGraded === 0}
              className="w-full py-3 rounded-xl text-white font-bold text-base disabled:opacity-40"
              style={{ backgroundColor: sub?.color }}>
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
              <p className="text-sm text-gray-500">Year 7 — Brentwood School</p>
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
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { key: 'grades',   label: '📊 School Grades' },
            { key: 'overview', label: '📈 Revision Progress' },
            { key: 'tests',    label: '📋 All Tests' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t.key ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-purple-50'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* SCHOOL GRADES TAB */}
        {tab === 'grades' && (
          <div className="space-y-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2">Subject</th>
                    <th className="text-center text-xs font-semibold text-gray-500 px-2 py-2 w-16">Dec</th>
                    <th className="text-center text-xs font-semibold text-gray-500 px-2 py-2 w-16">Jan</th>
                    <th className="text-center text-xs font-semibold text-gray-500 px-2 py-2 w-16">Apr</th>
                    <th className="text-center text-xs font-semibold text-gray-500 px-2 py-2 w-16">Trend</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {SUBJECTS.map(subject => {
                    const sg = grades[subject.id] ?? {}
                    const dec = sg['michaelmas-2025']?.grade
                    const jan = sg['lent-2026']?.grade
                    const apr = sg['trinity-2026']?.grade
                    const teacher = teachers[subject.id]
                    const isExpanded = expandedGrade === subject.id
                    return (
                      <>
                        <tr key={subject.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{subject.icon}</span>
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{subject.name}</p>
                                {teacher && <p className="text-xs text-gray-400">{teacher.name}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="text-center px-2 py-3"><GradePill grade={dec} /></td>
                          <td className="text-center px-2 py-3"><GradePill grade={jan} /></td>
                          <td className="text-center px-2 py-3"><GradePill grade={apr} /></td>
                          <td className="text-center px-2 py-3"><TrendBadge from={dec} to={apr} /></td>
                          <td className="text-center px-2 py-3">
                            <button
                              onClick={() => setExpandedGrade(isExpanded ? null : subject.id)}
                              className="text-gray-400 hover:text-gray-600 text-xs"
                            >
                              {isExpanded ? '▲' : '▼'}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={subject.id + '-comments'} className="bg-amber-50">
                            <td colSpan={6} className="px-4 pb-3 pt-1">
                              <div className="space-y-2">
                                {TERMS.map(({ key, label }) => {
                                  const termData = sg[key]
                                  if (!termData?.comment) return null
                                  return (
                                    <div key={key} className="p-3 bg-white rounded-lg border border-amber-100">
                                      <p className="text-xs font-semibold text-amber-800 mb-1">
                                        {label}{teacher ? ` — ${teacher.name}` : ''}
                                      </p>
                                      <p className="text-xs text-amber-700">{termData.comment}</p>
                                    </div>
                                  )
                                })}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Grade scale legend */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-2">Grade scale (GCSE aligned, max 9)</p>
              <div className="flex gap-3 flex-wrap">
                {[
                  { range: '8–9', label: 'Excellent',     color: '#1D9E75' },
                  { range: '7',   label: 'Good',          color: '#378ADD' },
                  { range: '6',   label: 'Satisfactory',  color: '#BA7517' },
                  { range: '1–5', label: 'Needs work',    color: '#D85A30' },
                ].map(g => (
                  <div key={g.range} className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
                    <span className="text-xs text-gray-600">{g.range} — {g.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REVISION PROGRESS TAB */}
        {tab === 'overview' && (
          <div className="space-y-3">
            {SUBJECTS.map(subject => {
              const subs = submissions.filter(s => s.subject_id === subject.id)
              const mcSubs = subs.filter(s => s.mc_total > 0)
              const scores = mcSubs.map(s => ({ pct: Math.round((s.score / s.mc_total) * 100) }))
              const exp = exposures[subject.id] ?? { seen: 0, total: 50 }
              const timeMin = Math.round((progress?.timeBySubject[subject.id] ?? 0) / 60)
              return (
                <div key={subject.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl">{subject.icon}</span>
                    <span className="font-semibold text-gray-800">{subject.name}</span>
                    <div className="ml-auto flex items-center gap-4 text-xs text-gray-500">
                      <span>⏱️ {timeMin} min</span>
                      <span>📝 {subs.length} test{subs.length !== 1 ? 's' : ''}</span>
                      {revisionStats[subject.id] && (
                        <>
                          <span>🃏 {revisionStats[subject.id].cardsFlipped} cards</span>
                          <span>📖 {revisionStats[subject.id].topicsOpened} topics</span>
                          <span>⏱️ {Math.round(revisionStats[subject.id].timeSeconds / 60)}m revision</span>
                        </>
                      )}
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
                    <div className="h-10 flex items-center text-xs text-gray-400">No tests yet</div>
                  )}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                    <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100, (exp.seen / Math.max(exp.total, 1)) * 100)}%`, backgroundColor: subject.color }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{exp.seen} of {exp.total} questions seen</span>
                    {scores.length > 0 && <span>Best: <strong style={{ color: subject.color }}>{Math.max(...scores.map(s => s.pct))}%</strong></span>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ALL TESTS TAB */}
        {tab === 'tests' && (
          <div className="space-y-3">
            {submissions.length === 0 && <p className="text-gray-400 text-center py-10">No tests completed yet</p>}
            {submissions.map(s => {
              const sub = SUBJECTS.find(x => x.id === s.subject_id)
              const total = s.mc_total > 0 ? s.mc_total : 10
              const pct = Math.min(100, Math.round((s.score / total) * 100))
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
                  <div className="text-right mr-3">
                    <div className="text-xl font-bold" style={{ color: sub?.color }}>{pct}%</div>
                    <div className="text-xs text-gray-400">{s.score}/{total}</div>
                  </div>
                  <button onClick={() => openReview(s.id)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition flex-shrink-0"
                    style={{ backgroundColor: sub?.color }}>
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
