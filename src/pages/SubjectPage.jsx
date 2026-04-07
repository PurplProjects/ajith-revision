import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSubject } from '../data/curriculum'
import { startSession, endSession, fetchSubjectSubmissions, fetchVisitedTopics } from '../lib/db'

export default function SubjectPage() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const subject = getSubject(subjectId)
  const [openTopic, setOpenTopic] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [visited, setVisited] = useState(new Set())
  const [elapsed, setElapsed] = useState(0)

  const sessionIdRef = useRef(null)
  const startTimeRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!subject) return
    fetchSubjectSubmissions(subjectId).then(setSubmissions)
    fetchVisitedTopics().then(setVisited)
  }, [subjectId])

  useEffect(() => {
    return () => stopSession()
  }, [])

  async function startTopicSession(topicId) {
    stopSession()
    const sid = await startSession(subjectId, topicId)
    sessionIdRef.current = sid
    startTimeRef.current = Date.now()
    setElapsed(0)
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
  }

  function stopSession() {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    if (sessionIdRef.current && startTimeRef.current) {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
      endSession(sessionIdRef.current, duration)
      sessionIdRef.current = null
      startTimeRef.current = null
    }
  }

  async function toggleTopic(topic) {
    if (openTopic === topic.id) {
      stopSession()
      setOpenTopic(null)
    } else {
      await startTopicSession(topic.id)
      setOpenTopic(topic.id)
    }
  }

  if (!subject) return <div className="text-center py-10 text-gray-500">Subject not found</div>

  const bestScore = submissions.length > 0
    ? Math.max(...submissions.filter(s => s.mc_total > 0).map(s => Math.round((s.score / s.mc_total) * 100)))
    : null

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
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

      <div className="mb-6 space-y-3">
        <h2 className="text-base font-semibold text-gray-700">📖 Revision Notes</h2>
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
                {openTopic === topic.id && (
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
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
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
  )
}
