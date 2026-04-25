import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUBJECTS } from '../data/curriculum'
import { seedQuestionsIfNeeded, fetchProgress, fetchExposuresBySubject, fetchStudentGrades } from '../lib/db'

const TERM_ORDER = ['michaelmas-2025', 'lent-2026', 'trinity-2026']
const LATEST_TERM = 'trinity-2026'

function gradeColor(grade) {
  if (grade >= 8) return '#1D9E75'
  if (grade === 7) return '#378ADD'
  if (grade === 6) return '#BA7517'
  if (grade <= 5) return '#D85A30'
  return '#888780'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(null)
  const [exposures, setExposures] = useState({})
  const [grades, setGrades] = useState({}) // { subjectId: { term: grade } }
  const [seeding, setSeeding] = useState(true)

  useEffect(() => {
    async function init() {
      await seedQuestionsIfNeeded()
      setSeeding(false)
      const [p, e, g] = await Promise.all([
        fetchProgress(),
        fetchExposuresBySubject(),
        fetchStudentGrades(),
      ])
      setProgress(p)
      setExposures(e)
      // Index grades by subject and term
      const gradeMap = {}
      for (const row of g) {
        if (!gradeMap[row.subject_id]) gradeMap[row.subject_id] = {}
        gradeMap[row.subject_id][row.term] = row.grade
      }
      setGrades(gradeMap)
    }
    init()
  }, [])

  const totalAttempts = progress ? Object.values(progress.attemptsBySubject).reduce((a, b) => a + b, 0) : 0
  const totalMinutes = progress ? Math.round(Object.values(progress.timeBySubject).reduce((a, b) => a + b, 0) / 60) : 0

  if (seeding) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="text-4xl animate-spin">⚙️</div>
      <p className="text-gray-600 font-medium">Setting up your revision hub…</p>
      <p className="text-gray-400 text-sm">Loading questions for the first time</p>
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">👋 Welcome back, Ajith!</h1>
        <p className="text-gray-500 mt-1">Ajith's Year 7 Revision Hub — choose a subject to study or test yourself.</p>
      </div>

      {/* Stats bar */}
      {progress && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Tests completed', value: totalAttempts, icon: '📝' },
            { label: 'Minutes studied', value: totalMinutes, icon: '⏱️' },
            { label: 'Subjects attempted', value: Object.keys(progress.attemptsBySubject).length, icon: '📚' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-gray-800">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Subject grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {SUBJECTS.map(subject => {
          const attempts = progress?.attemptsBySubject[subject.id] ?? 0
          const scores = progress?.scoresBySubject[subject.id] ?? []
          const lastScore = scores.length > 0 ? scores[scores.length - 1] : null
          const pct = lastScore ? Math.round((lastScore.score / lastScore.total) * 100) : null
          const exp = exposures[subject.id] ?? { seen: 0, total: 50 }
          const subjectGrades = grades[subject.id] ?? {}
          const latestGrade = subjectGrades[LATEST_TERM]
          const prevGrade = subjectGrades['lent-2026']
          const trend = latestGrade && prevGrade ? latestGrade - prevGrade : null

          return (
            <div
              key={subject.id}
              onClick={() => navigate(`/subject/${subject.id}`)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl">{subject.icon}</span>
                {latestGrade && (
                  <div className="flex items-center gap-1">
                    {trend !== null && trend !== 0 && (
                      <span className="text-xs font-bold" style={{ color: trend > 0 ? '#1D9E75' : '#D85A30' }}>
                        {trend > 0 ? '▲' : '▼'}
                      </span>
                    )}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-black shadow-sm"
                      style={{ backgroundColor: gradeColor(latestGrade) }}
                    >
                      {latestGrade}
                    </div>
                  </div>
                )}
              </div>
              <h2 className="font-bold text-gray-800 text-base">{subject.name}</h2>
              <p className="text-xs text-gray-400 mt-0.5 mb-3">{subject.description}</p>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (exp.seen / Math.max(exp.total, 1)) * 100)}%`, backgroundColor: subject.color }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{exp.seen}/{exp.total} questions seen</span>
                {pct !== null && (
                  <span className="font-semibold" style={{ color: subject.color }}>
                    Test: {pct}%
                  </span>
                )}
              </div>
              {attempts > 0 && (
                <div className="mt-1 text-xs text-gray-400">{attempts} test{attempts > 1 ? 's' : ''} done</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
