import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUBJECTS } from '../data/curriculum'
import { fetchProgress, fetchWeeklyActivity } from '../lib/db'

function formatTime(seconds) {
  if (!seconds) return '0m'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default function ProgressPage() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(null)
  const [weeklyData, setWeeklyData] = useState({})

  useEffect(() => {
    Promise.all([fetchProgress(), fetchWeeklyActivity()]).then(([prog, weekly]) => {
      setProgress(prog)
      setWeeklyData(weekly)
    })
  }, [])

  const totalSeconds = progress
    ? Object.values(progress.timeBySubject).reduce((a, b) => a + b, 0)
    : 0
  const assignmentsDone = progress
    ? Object.values(progress.submissionsBySubject).filter(Boolean).length
    : 0
  const allConfidences = progress
    ? Object.values(progress.confidenceBySubject).flat()
    : []
  const avgConfidence = allConfidences.length
    ? (allConfidences.reduce((a, b) => a + b, 0) / allConfidences.length).toFixed(1)
    : null

  const maxSubjectSeconds = progress
    ? Math.max(...SUBJECTS.map(s => progress.timeBySubject[s.id] ?? 0), 1)
    : 1

  const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const totalWeekMinutes = WEEK_DAYS.reduce((a, d) => a + (weeklyData[d] ?? 0), 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Progress overview</h1>
        <p className="text-sm text-gray-500 mt-1">All revision activity for Ajith — Easter 2025</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total study time', value: formatTime(totalSeconds) },
          { label: 'This week', value: `${totalWeekMinutes}m` },
          { label: 'Assignments done', value: `${assignmentsDone} / ${SUBJECTS.length}` },
          { label: 'Avg confidence', value: avgConfidence ? `${avgConfidence}/5` : '—' },
        ].map(s => (
          <div key={s.label} className="bg-gray-100 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className="text-xl font-semibold text-gray-900">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Per-subject breakdown */}
      <h2 className="text-sm font-medium text-gray-700 mb-3">Time per subject</h2>
      <div className="card mb-8">
        <div className="space-y-4">
          {SUBJECTS.map(subject => {
            const seconds = progress?.timeBySubject[subject.id] ?? 0
            const pct = maxSubjectSeconds > 0 ? Math.round((seconds / maxSubjectSeconds) * 100) : 0
            const topicsVisited = progress?.topicsBySubject[subject.id]?.size ?? 0
            const done = progress?.submissionsBySubject[subject.id]
            const confidence = progress?.confidenceBySubject[subject.id]
            const avgConf = confidence?.length
              ? (confidence.reduce((a, b) => a + b, 0) / confidence.length).toFixed(1)
              : null

            return (
              <div key={subject.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{subject.icon}</span>
                    <span className="text-sm font-medium text-gray-800">{subject.name}</span>
                    {done && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: '#E1F5EE', color: '#0F6E56' }}
                      >
                        ✓ assignment done
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    {avgConf && (
                      <span className="text-xs text-gray-400">confidence: {avgConf}/5</span>
                    )}
                    <span className="text-sm font-medium text-gray-700 w-14">
                      {formatTime(seconds)}
                    </span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${pct}%`, background: subject.color }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400">
                    {topicsVisited} of {subject.topics.length} topics visited
                  </span>
                  <button
                    onClick={() => navigate(`/subject/${subject.id}`)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Study →
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Weekly breakdown */}
      <h2 className="text-sm font-medium text-gray-700 mb-3">This week day by day</h2>
      <div className="card mb-8">
        <div className="grid grid-cols-7 gap-2">
          {WEEK_DAYS.map(day => {
            const mins = weeklyData[day] ?? 0
            const max = Math.max(...WEEK_DAYS.map(d => weeklyData[d] ?? 0), 1)
            const pct = Math.round((mins / max) * 100)
            return (
              <div key={day} className="text-center">
                <div className="text-xs text-gray-400 mb-2">{day}</div>
                <div className="h-20 bg-gray-100 rounded-lg relative overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-lg transition-all"
                    style={{ height: `${pct}%`, background: '#378ADD', minHeight: mins > 0 ? '4px' : '0' }}
                  />
                </div>
                <div className="text-xs font-medium text-gray-600 mt-1.5">{mins > 0 ? `${mins}m` : '—'}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Confidence per subject */}
      {allConfidences.length > 0 && (
        <>
          <h2 className="text-sm font-medium text-gray-700 mb-3">Confidence by subject</h2>
          <div className="card">
            <div className="space-y-3">
              {SUBJECTS.filter(s => progress?.confidenceBySubject[s.id]?.length).map(subject => {
                const confs = progress.confidenceBySubject[subject.id]
                const avg = confs.reduce((a, b) => a + b, 0) / confs.length
                return (
                  <div key={subject.id} className="flex items-center gap-3">
                    <span className="text-base">{subject.icon}</span>
                    <span className="text-sm text-gray-700 w-24 flex-shrink-0">{subject.name}</span>
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <div
                          key={n}
                          className="flex-1 h-5 rounded-sm"
                          style={{
                            background: n <= Math.round(avg) ? subject.color : '#F3F4F6',
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-8">{avg.toFixed(1)}</span>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Confidence is self-rated 1–5 at the end of each assignment.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
