import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUBJECTS } from '../data/curriculum'
import { fetchProgress, fetchWeeklyActivity, fetchRecentActivity } from '../lib/db'

function formatTime(seconds) {
  if (!seconds) return '0m'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function timeAgo(isoString) {
  const diff = (Date.now() - new Date(isoString)) / 1000
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(null)
  const [weeklyData, setWeeklyData] = useState({})
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchProgress(), fetchWeeklyActivity(), fetchRecentActivity()])
      .then(([prog, weekly, recent]) => {
        setProgress(prog)
        setWeeklyData(weekly)
        setRecentActivity(recent)
      })
      .finally(() => setLoading(false))
  }, [])

  const totalSeconds = progress
    ? Object.values(progress.timeBySubject).reduce((a, b) => a + b, 0)
    : 0
  const subjectsVisited = progress
    ? Object.keys(progress.timeBySubject).filter(k => progress.timeBySubject[k] > 0).length
    : 0
  const assignmentsDone = progress
    ? Object.values(progress.submissionsBySubject).filter(Boolean).length
    : 0
  const allConfidences = progress
    ? Object.values(progress.confidenceBySubject).flat()
    : []
  const avgConfidence = allConfidences.length
    ? (allConfidences.reduce((a, b) => a + b, 0) / allConfidences.length).toFixed(1)
    : '—'

  const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const maxMinutes = Math.max(...WEEK_DAYS.map(d => weeklyData[d] ?? 0), 1)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{greeting()}, Ajith</h1>
        <p className="text-sm text-gray-500 mt-1">
          {subjectsVisited === 0
            ? 'Ready to start? Pick a subject below.'
            : `You've studied ${subjectsVisited} subject${subjectsVisited !== 1 ? 's' : ''} so far this holiday.`}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total study time', value: formatTime(totalSeconds) },
          { label: 'Subjects visited', value: `${subjectsVisited} of ${SUBJECTS.length}` },
          { label: 'Assignments done', value: `${assignmentsDone} of ${SUBJECTS.length}` },
          { label: 'Avg confidence', value: `${avgConfidence}${avgConfidence !== '—' ? '/5' : ''}` },
        ].map(stat => (
          <div key={stat.label} className="bg-gray-100 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
            <div className="text-xl font-semibold text-gray-900">{loading ? '…' : stat.value}</div>
          </div>
        ))}
      </div>

      {/* Subjects grid */}
      <h2 className="text-sm font-medium text-gray-700 mb-3">Subjects</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {SUBJECTS.map(subject => {
          const topicCount = subject.topics.length
          const visitedCount = progress?.topicsBySubject[subject.id]?.size ?? 0
          const pct = Math.round((visitedCount / topicCount) * 100)
          const subjectSeconds = progress?.timeBySubject[subject.id] ?? 0
          const done = progress?.submissionsBySubject[subject.id]

          return (
            <button
              key={subject.id}
              onClick={() => navigate(`/subject/${subject.id}`)}
              className="card text-left hover:border-gray-300 transition-colors group"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3"
                style={{ background: subject.bgColor }}
              >
                {subject.icon}
              </div>
              <div className="text-sm font-medium text-gray-900 mb-0.5">{subject.name}</div>
              <div className="text-xs text-gray-400 mb-3">{subject.description}</div>
              <div className="progress-bar mb-1">
                <div
                  className="progress-fill"
                  style={{ width: `${pct}%`, background: subject.color }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">
                  {subjectSeconds > 0 ? formatTime(subjectSeconds) : 'Not started'}
                </span>
                {done && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: '#E1F5EE', color: '#0F6E56' }}
                  >
                    ✓ done
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Bottom row: bar chart + recent activity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Weekly bar chart */}
        <div className="card">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Study time this week (minutes)</h3>
          <div className="flex items-end gap-2 h-20 mb-2">
            {WEEK_DAYS.map(day => {
              const mins = weeklyData[day] ?? 0
              const height = maxMinutes > 0 ? Math.max((mins / maxMinutes) * 80, mins > 0 ? 4 : 0) : 0
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm transition-all"
                    style={{
                      height: `${height}px`,
                      background: mins > 0 ? '#378ADD' : '#E5E7EB',
                    }}
                  />
                </div>
              )
            })}
          </div>
          <div className="flex gap-2">
            {WEEK_DAYS.map(day => (
              <div key={day} className="flex-1 text-center text-xs text-gray-400">{day}</div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="card">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Recent activity</h3>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-400">No sessions yet — pick a subject to get started!</p>
          ) : (
            <div className="space-y-0">
              {recentActivity.map((session, i) => {
                const subject = SUBJECTS.find(s => s.id === session.subject_id)
                const topic = subject?.topics.find(t => t.id === session.topic_id)
                return (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: subject?.color ?? '#999' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">{subject?.name}</div>
                      <div className="text-xs text-gray-400 truncate">{topic?.title}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-gray-400">{timeAgo(session.started_at)}</div>
                      <div className="text-xs text-gray-500">{formatTime(session.duration_seconds)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
