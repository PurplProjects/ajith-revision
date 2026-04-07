import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUBJECTS } from '../data/curriculum'
import { fetchProgress, fetchExposuresBySubject, fetchAllSubmissions } from '../lib/db'

export default function ProgressPage() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(null)
  const [exposures, setExposures] = useState({})
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [p, e, s] = await Promise.all([fetchProgress(), fetchExposuresBySubject(), fetchAllSubmissions()])
      setProgress(p)
      setExposures(e)
      setSubmissions(s)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="text-center py-20 text-gray-400">Loading progress…</div>

  const totalTime = Math.round(Object.values(progress.timeBySubject).reduce((a, b) => a + b, 0) / 60)
  const totalAttempts = Object.values(progress.attemptsBySubject).reduce((a, b) => a + b, 0)

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600">←</button>
        <h1 className="text-2xl font-bold text-gray-900">📊 My Progress</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Tests done', value: totalAttempts, icon: '📝' },
          { label: 'Total minutes', value: totalTime, icon: '⏱️' },
          { label: 'Questions seen', value: Object.values(exposures).reduce((a, b) => a + b.seen, 0), icon: '👁️' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-gray-800">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Per subject */}
      <div className="space-y-3">
        {SUBJECTS.map(subject => {
          const attempts = progress.attemptsBySubject[subject.id] ?? 0
          const scores = progress.scoresBySubject[subject.id] ?? []
          const exp = exposures[subject.id] ?? { seen: 0, total: 50 }
          const timeMin = Math.round((progress.timeBySubject[subject.id] ?? 0) / 60)
          const bestPct = scores.length > 0 ? Math.max(...scores.map(s => Math.round((s.score / s.total) * 100))) : null
          const latestPct = scores.length > 0 ? Math.round((scores[scores.length - 1].score / scores[scores.length - 1].total) * 100) : null

          return (
            <div key={subject.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{subject.icon}</span>
                <span className="font-semibold text-gray-800">{subject.name}</span>
                <div className="ml-auto flex gap-3 text-xs text-gray-500">
                  <span>{attempts} test{attempts !== 1 ? 's' : ''}</span>
                  <span>{timeMin} min</span>
                </div>
              </div>

              {/* Score trend */}
              {scores.length > 0 ? (
                <div className="flex gap-1 mb-2 items-end h-10">
                  {scores.slice(-10).map((s, i) => {
                    const h = Math.round((s.score / s.total) * 100)
                    return (
                      <div key={i} className="flex-1 rounded-t relative group" style={{ height: `${h}%`, minHeight: 4, backgroundColor: subject.color + 'aa' }}>
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 whitespace-nowrap">{h}%</div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="h-10 flex items-center text-xs text-gray-400">No tests yet</div>
              )}

              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100, (exp.seen / Math.max(exp.total, 1)) * 100)}%`, backgroundColor: subject.color }} />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{exp.seen} of {exp.total} questions seen</span>
                <div className="flex gap-3">
                  {bestPct !== null && <span>Best: <span className="font-semibold" style={{ color: subject.color }}>{bestPct}%</span></span>}
                  {latestPct !== null && <span>Latest: <span className="font-semibold">{latestPct}%</span></span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent activity */}
      {submissions.slice(0, 5).length > 0 && (
        <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-3 text-sm">Recent tests</h3>
          {submissions.slice(0, 5).map(s => {
            const sub = SUBJECTS.find(x => x.id === s.subject_id)
            const pct = s.mc_total > 0 ? Math.round((s.score / s.mc_total) * 100) : null
            return (
              <div key={s.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <span>{sub?.icon}</span>
                <div className="flex-1">
                  <span className="text-sm text-gray-700">{s.subject_name}</span>
                  <span className="text-xs text-gray-400 ml-2">Attempt #{s.attempt_number}</span>
                </div>
                {pct !== null && <span className="text-sm font-semibold" style={{ color: sub?.color }}>{pct}%</span>}
                <span className="text-xs text-gray-400">{new Date(s.submitted_at).toLocaleDateString('en-GB')}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
