import { useEffect, useState } from 'react'
import { SUBJECTS } from '../data/curriculum'
import { fetchAllSubmissions, fetchProgress, fetchExposuresBySubject } from '../lib/db'

const CONFIDENCE_LABELS = { 1: '😟 Very unsure', 2: '😕 Unsure', 3: '😐 OK', 4: '🙂 Confident', 5: '😄 Very confident' }

export default function ParentDashboard() {
  const [submissions, setSubmissions] = useState([])
  const [progress, setProgress] = useState(null)
  const [exposures, setExposures] = useState({})
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview') // overview | detail | answers

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

  // Per-subject summary
  const subjectSummary = SUBJECTS.map(subject => {
    const subs = submissions.filter(s => s.subject_id === subject.id)
    const mcSubs = subs.filter(s => s.mc_total > 0)
    const scores = mcSubs.map(s => ({ pct: Math.round((s.score / s.mc_total) * 100), attempt: s.attempt_number, date: s.submitted_at }))
    const avgConf = subs.filter(s => s.confidence_rating).length > 0
      ? (subs.filter(s => s.confidence_rating).reduce((a, s) => a + s.confidence_rating, 0) / subs.filter(s => s.confidence_rating).length).toFixed(1)
      : null
    const exp = exposures[subject.id] ?? { seen: 0, total: 50 }
    const timeMin = Math.round((progress?.timeBySubject[subject.id] ?? 0) / 60)
    return { subject, subs, scores, avgConf, exp, timeMin }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
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
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-white text-center">
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
            { key: 'detail', label: '📈 Test History' },
            { key: 'answers', label: '📝 Written Answers' },
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
            {subjectSummary.map(({ subject, subs, scores, avgConf, exp, timeMin }) => (
              <div key={subject.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">{subject.icon}</span>
                  <span className="font-semibold text-gray-800">{subject.name}</span>
                  <div className="ml-auto flex items-center gap-4 text-xs text-gray-500">
                    <span>⏱️ {timeMin} min</span>
                    <span>📝 {subs.length} test{subs.length !== 1 ? 's' : ''}</span>
                    {avgConf && <span>💬 Confidence: {avgConf}/5</span>}
                  </div>
                </div>

                {/* Score bars */}
                {scores.length > 0 ? (
                  <>
                    <div className="flex gap-1 mb-2 items-end h-12">
                      {scores.slice(-10).map((s, i) => (
                        <div key={i} className="flex-1 rounded-t flex flex-col items-center justify-start group relative" style={{ height: `${s.pct}%`, minHeight: 4, backgroundColor: subject.color }}>
                          <div className="absolute -top-5 text-xs text-gray-600 opacity-0 group-hover:opacity-100">{s.pct}%</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>Score over {scores.length} test{scores.length !== 1 ? 's' : ''} (latest right)</span>
                      <span>Best: <strong style={{ color: subject.color }}>{Math.max(...scores.map(s => s.pct))}%</strong> | Latest: <strong>{scores[scores.length - 1].pct}%</strong></span>
                    </div>
                  </>
                ) : (
                  <div className="h-12 flex items-center text-xs text-gray-400">Not attempted yet</div>
                )}

                {/* Question coverage */}
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100, (exp.seen / Math.max(exp.total, 1)) * 100)}%`, backgroundColor: subject.color }} />
                </div>
                <div className="text-xs text-gray-400 mt-1">{exp.seen} of {exp.total} questions seen</div>
              </div>
            ))}
          </div>
        )}

        {/* DETAIL TAB */}
        {tab === 'detail' && (
          <div className="space-y-3">
            {submissions.length === 0 && <p className="text-gray-400 text-center py-10">No tests completed yet</p>}
            {submissions.map(s => {
              const sub = SUBJECTS.find(x => x.id === s.subject_id)
              const pct = s.mc_total > 0 ? Math.round((s.score / s.mc_total) * 100) : null
              return (
                <div key={s.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{sub?.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{s.subject_name}</div>
                      <div className="text-xs text-gray-400">
                        Attempt #{s.attempt_number} · {new Date(s.submitted_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                      </div>
                    </div>
                    {pct !== null && (
                      <div className="text-right">
                        <div className="text-xl font-bold" style={{ color: sub?.color }}>{pct}%</div>
                        <div className="text-xs text-gray-400">{s.score}/{s.mc_total} MC</div>
                      </div>
                    )}
                    {s.confidence_rating && (
                      <div className="text-xs text-gray-500 text-right">
                        {CONFIDENCE_LABELS[s.confidence_rating]}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ANSWERS TAB */}
        {tab === 'answers' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">All short-answer responses Ajith has written during tests.</p>
            {submissions.length === 0 && <p className="text-gray-400 text-center py-10">No tests completed yet</p>}
            {submissions.map(s => {
              const sub = SUBJECTS.find(x => x.id === s.subject_id)
              const saAnswers = Object.entries(s.answers ?? {}).filter(([qId, ans]) =>
                typeof ans === 'string' && ans.trim().length > 0
              )
              if (saAnswers.length === 0) return null
              return (
                <div key={s.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span>{sub?.icon}</span>
                    <span className="font-semibold text-gray-800">{s.subject_name}</span>
                    <span className="text-xs text-gray-400">Attempt #{s.attempt_number} · {new Date(s.submitted_at).toLocaleDateString('en-GB')}</span>
                  </div>
                  {saAnswers.map(([qId, ans]) => (
                    <div key={qId} className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 mb-1">Q: {qId}</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{ans}</p>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
