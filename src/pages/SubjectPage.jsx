import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getSubject } from '../data/curriculum'
import { useSessionTimer } from '../lib/useSessionTimer'
import { fetchVisitedTopics, fetchSubmission } from '../lib/db'

export default function SubjectPage() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const subject = getSubject(subjectId)
  const [topicIndex, setTopicIndex] = useState(0)
  const [visitedTopics, setVisitedTopics] = useState(new Set())
  const [assignmentDone, setAssignmentDone] = useState(false)

  useEffect(() => {
    if (!subject) return
    fetchVisitedTopics().then(setVisitedTopics)
    fetchSubmission(subjectId).then(sub => setAssignmentDone(!!sub))
  }, [subjectId, subject])

  const topic = subject?.topics[topicIndex]
  const { formatted } = useSessionTimer(
    topic ? subjectId : null,
    topic ? topic.id : null
  )

  if (!subject) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Subject not found.</p>
        <Link to="/" className="btn-primary mt-4 inline-block">Back to dashboard</Link>
      </div>
    )
  }

  const handleTopicChange = (idx) => {
    setTopicIndex(idx)
    window.scrollTo(0, 0)
  }

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/')} className="btn-secondary text-xs">
          ← Dashboard
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{subject.icon}</span>
            <h1 className="text-lg font-semibold text-gray-900">{subject.name}</h1>
          </div>
          <p className="text-xs text-gray-400">{subject.description}</p>
        </div>
        <div
          className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border"
          style={{ background: '#EAF3DE', color: '#3B6D11', borderColor: '#97C459' }}
        >
          <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
          {formatted} this session
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Topics</p>
            <div className="space-y-1">
              {subject.topics.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => handleTopicChange(i)}
                  className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    i === topicIndex
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: subject.color }}
                  />
                  <span className="flex-1">{t.title}</span>
                  {visitedTopics.has(t.id) && (
                    <span className="text-green-600 text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Assignment</p>
              <Link
                to={`/subject/${subjectId}/assignment`}
                className="w-full text-center block text-sm py-2 px-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {assignmentDone ? '✓ Review assignment' : 'Go to assignment →'}
              </Link>
              {!assignmentDone && (
                <p className="text-xs text-gray-400 mt-2">Complete all topics first for best results.</p>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <div className="card mb-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{topic.title}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Topic {topicIndex + 1} of {subject.topics.length}
                </p>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: subject.bgColor, color: subject.textColor }}
              >
                {subject.name}
              </span>
            </div>

            {/* Progress bar */}
            <div className="progress-bar mb-5">
              <div
                className="progress-fill"
                style={{
                  width: `${((topicIndex + 1) / subject.topics.length) * 100}%`,
                  background: subject.color,
                }}
              />
            </div>

            {/* Content sections */}
            {topic.content.map((section, si) => (
              <div key={si} className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span
                    className="inline-block w-1 h-4 rounded-full"
                    style={{ background: subject.color }}
                  />
                  {section.heading}
                </h3>
                <ul className="space-y-0">
                  {section.points.map((point, pi) => (
                    <li
                      key={pi}
                      className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-xs text-gray-300 mt-0.5 flex-shrink-0 font-mono">
                        {String(pi + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm text-gray-700 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Tip box */}
            {topic.tip && (
              <div
                className="mt-2 p-4 rounded-r-lg border-l-2 text-sm"
                style={{
                  background: subject.bgColor,
                  borderColor: subject.color,
                  color: subject.textColor,
                }}
              >
                <p className="font-medium text-xs mb-1" style={{ color: subject.color }}>
                  Revision tip
                </p>
                {topic.tip}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleTopicChange(topicIndex - 1)}
              disabled={topicIndex === 0}
              className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← {topicIndex > 0 ? subject.topics[topicIndex - 1].title : 'Previous'}
            </button>
            <span className="text-xs text-gray-400">
              {topicIndex + 1} / {subject.topics.length}
            </span>
            {topicIndex < subject.topics.length - 1 ? (
              <button
                onClick={() => handleTopicChange(topicIndex + 1)}
                className="btn-primary"
              >
                {subject.topics[topicIndex + 1].title} →
              </button>
            ) : (
              <Link
                to={`/subject/${subjectId}/assignment`}
                className="btn-primary"
              >
                Go to assignment →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
