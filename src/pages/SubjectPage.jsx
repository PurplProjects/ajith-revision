import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSubject } from '../data/curriculum'
import { startSession, endSession, fetchSubjectSubmissions, fetchVisitedTopics, fetchStudentTeachers, fetchStudentGrades } from '../lib/db'
import RevisionPanel from '../components/RevisionPanel'

// Add new subjects here as revision content is built
const revisionModules = {
  physics: () => import('../data/revision/physics.js').then(m => m.physicsRevision),
  latin:    () => import('../data/revision/latin.js').then(m => m.latinRevision),
  mandarin: () => import('../data/revision/mandarin.js').then(m => m.mandarinRevision),
  cs:      () => import('../data/revision/cs.js').then(m => m.csRevision),
}


const GRADE_TERMS = [
  { key: 'michaelmas-2025', label: 'Dec' },
  { key: 'lent-2026',       label: 'Jan' },
  { key: 'trinity-2026',    label: 'Apr' },
]

function gradeColor(g) {
  if (g >= 8) return '#1D9E75'
  if (g === 7) return '#378ADD'
  if (g === 6) return '#BA7517'
  return '#D85A30'
}

function GradeStrip({ subjectId, grades, teachers }) {
  const sg = grades[subjectId] ?? {}
  const teacher = teachers[subjectId]
  const termGrades = GRADE_TERMS.map(t => ({ ...t, grade: sg[t.key]?.grade, comment: sg[t.key]?.comment }))
  const hasAny = termGrades.some(t => t.grade)
  const latestComment = sg['trinity-2026']?.comment ?? sg['lent-2026']?.comment ?? sg['michaelmas-2025']?.comment
  if (!hasAny) return null
  return (
    <div className="mb-5 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-50">
        <span className="text-xs font-semibold text-gray-500 flex-shrink-0">School grades</span>
        <div className="flex items-center gap-3">
          {termGrades.map(({ key, label, grade }, i) => {
            if (!grade) return null
            return (
              <div key={key} className="flex items-center gap-2">
                {i > 0 && <span className="text-gray-300 text-xs">→</span>}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400 mb-0.5">{label}</span>
                  <span
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-black shadow-sm"
                    style={{ backgroundColor: gradeColor(grade) }}
                  >{grade}</span>
                </div>
              </div>
            )
          })}
        </div>
        {teacher && <span className="ml-auto text-xs text-gray-400">{teacher.name}</span>}
      </div>
      {latestComment && (
        <div className="px-4 py-3 bg-amber-50">
          <p className="text-xs font-semibold text-amber-700 mb-1">💬 Teacher feedback</p>
          <p className="text-xs text-gray-700">{latestComment}</p>
        </div>
      )}
    </div>
  )
}

export default function SubjectPage() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const subject = getSubject(subjectId)

  const [tab, setTab] = useState('notes')
  const [openTopic, setOpenTopic] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [visited, setVisited] = useState(new Set())
  const [elapsed, setElapsed] = useState(0)
  const [revisionData, setRevisionData] = useState(null)
  const [teachers, setTeachers] = useState({})
  const [grades, setGrades] = useState({})

  const sessionIdRef = useRef(null)
  const startTimeRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!subject) return
    setTab('notes')
    setRevisionData(null)
    fetchSubjectSubmissions(subjectId).then(setSubmissions)
    fetchVisitedTopics().then(setVisited)
    if (revisionModules[subjectId]) {
      revisionModules[subjectId]().then(setRevisionData)
    }
    fetchStudentTeachers().then(setTeachers)
    fetchStudentGrades().then(rows => {
      const map = {}
      for (const row of rows) {
        if (!map[row.subject_id]) map[row.subject_id] = {}
        map[row.subject_id][row.term] = { grade: row.grade, comment: row.teacher_comment }
      }
      setGrades(map)
    })
  }, [subjectId])

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current)
      if (sessionIdRef.current && startTimeRef.current) {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
        endSession(sessionIdRef.current, duration)
      }
      sessionIdRef.current = null
      startTimeRef.current = null
    }
  }, [])

  function stopSession() {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    if (sessionIdRef.current && startTimeRef.current) {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
      endSession(sessionIdRef.current, duration)
    }
    sessionIdRef.current = null
    startTimeRef.current = null
    setElapsed(0)
  }

  async function startTopicSession(topicId) {
    stopSession()
    const sid = await startSession(subjectId, topicId)
    if (!sid) return
    sessionIdRef.current = sid
    startTimeRef.current = Date.now()
    setElapsed(0)
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }
    }, 1000)
  }

  async function toggleTopic(topic) {
    if (openTopic === topic.id) {
      stopSession()
      setOpenTopic(null)
    } else {
      setOpenTopic(topic.id)
      await startTopicSession(topic.id)
    }
  }

  if (!subject) return <div className="text-center py-10 text-gray-500">Subject not found</div>

  const hasRevision = !!revisionModules[subjectId]
  const bestScore = submissions.length > 0
    ? Math.max(...submissions.filter(s => s.mc_total > 0).map(s => Math.round((s.score / s.mc_total) * 100)))
    : null

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => { stopSession(); navigate('/') }} className="text-gray-400 hover:text-gray-600">←</button>
        <span className="text-3xl">{subject.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{subject.name}</h1>
          <p className="text-sm text-gray-500">{subject.description}</p>
        </div>
        <div className="ml-auto flex flex-col items-end gap-1">
          {bestScore !== null && (
            <span className="text-sm font-semibold" style={{ color: subject.color }}>Best: {bestScore}%</span>
          )}
          <span className="text-xs text-gray-400">{submissions.length} attempt{submissions.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <GradeStrip subjectId={subjectId} grades={grades} teachers={teachers} />

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTab('notes')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === 'notes' ? 'text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          style={tab === 'notes' ? { backgroundColor: subject.color } : {}}
        >
          📖 Notes
        </button>
        {hasRevision && (
          <button
            onClick={() => setTab('revision')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === 'revision' ? 'text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            style={tab === 'revision' ? { backgroundColor: subject.color } : {}}
          >
            🃏 Revision
          </button>
        )}
        <button
          onClick={() => { stopSession(); navigate(`/subject/${subjectId}/test`) }}
          className="ml-auto px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition"
          style={{ backgroundColor: subject.color }}
        >
          Start Test →
        </button>
      </div>

      {tab === 'notes' && (
        <div className="space-y-3">
          {subject.topics.map(topic => (
            <div key={topic.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggleTopic(topic)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  {visited.has(topic.id) && <span className="text-green-500 text-sm">✓</span>}
                  <span className="font-medium text-gray-800">{topic.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {openTopic === topic.id && elapsed > 0 && (
                    <span className="text-xs text-indigo-500 font-medium">{elapsed}s</span>
                  )}
                  <span className="text-gray-400 text-sm">{openTopic === topic.id ? '▲' : '▼'}</span>
                </div>
              </button>
              {openTopic === topic.id && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  {topic.content.map((section, i) => (
                    <div key={i} className="mt-3">
                      <h3 className="font-semibold text-gray-700 text-sm mb-2">{section.heading}</h3>
                      <ul className="space-y-1">
                        {section.points.map((p, j) => (
                          <li key={j} className="text-sm text-gray-600 flex gap-2">
                            <span className="text-indigo-400 flex-shrink-0">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {topic.tip && (
                    <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <span className="text-xs font-semibold text-amber-700">💡 Revision tip: </span>
                      <span className="text-xs text-amber-700">{topic.tip}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center mt-2">
            <h3 className="font-bold text-gray-800 text-lg mb-1">Ready to test yourself?</h3>
            <p className="text-sm text-gray-500 mb-4">10 questions — mix of difficulty levels — instant results</p>
            <button
              onClick={() => { stopSession(); navigate(`/subject/${subjectId}/test`) }}
              className="px-8 py-3 rounded-xl font-bold text-white text-base shadow-md hover:opacity-90 transition"
              style={{ backgroundColor: subject.color }}
            >
              Start Test →
            </button>
            {submissions.length > 0 && (
              <p className="text-xs text-gray-400 mt-3">Attempt #{submissions.length + 1}</p>
            )}
          </div>
        </div>
      )}

      {tab === 'revision' && (
        <RevisionPanel revision={revisionData} subjectColor={subject.color} teacher={teachers[subjectId]} />
      )}
    </div>
  )
}
