import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const EXAMS = [
  { date: '2026-06-01', day: 'Mon 1 Jun', subject: 'Biology',    subjectId: 'biology',   time: '09:50', duration: '1 hour',     session: 1, color: '#1D9E75', icon: '🧬' },
  { date: '2026-06-01', day: 'Mon 1 Jun', subject: 'History',    subjectId: 'history',   time: '14:55', duration: '1 hour',     session: 3, color: '#D85A30', icon: '🏛️' },
  { date: '2026-06-02', day: 'Tue 2 Jun', subject: 'English',    subjectId: 'english',   time: '09:20', duration: '1.5 hours',  session: 1, color: '#378ADD', icon: '✏️' },
  { date: '2026-06-02', day: 'Tue 2 Jun', subject: 'Physics',    subjectId: 'physics',   time: '14:55', duration: '1 hour',     session: 3, color: '#D85A30', icon: '⚡' },
  { date: '2026-06-03', day: 'Wed 3 Jun', subject: 'Careers Trip', subjectId: null,      time: '08:30', duration: 'All day',    session: 0, color: '#888780', icon: '🚌' },
  { date: '2026-06-04', day: 'Thu 4 Jun', subject: 'Chemistry',  subjectId: 'chemistry', time: '09:50', duration: '1 hour',     session: 1, color: '#7F77DD', icon: '⚗️' },
  { date: '2026-06-04', day: 'Thu 4 Jun', subject: 'Theology & Philosophy', subjectId: 'tp', time: '11:55', duration: '1 hour', session: 2, color: '#7C3AED', icon: '✡️' },
  { date: '2026-06-05', day: 'Fri 5 Jun', subject: 'Geography',  subjectId: 'geography', time: '09:50', duration: '1 hour',     session: 1, color: '#1D9E75', icon: '🌍' },
  { date: '2026-06-05', day: 'Fri 5 Jun', subject: 'Maths',      subjectId: 'maths',     time: '11:25', duration: '1.5 hours',  session: 2, color: '#BA7517', icon: '➕' },
]

function getCountdown(examDate, examTime) {
  const now = new Date()
  const [hours, mins] = examTime.split(':').map(Number)
  const exam = new Date(examDate)
  exam.setHours(hours, mins, 0, 0)
  const diff = exam - now
  if (diff <= 0) return { past: true }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hrs  = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins2 = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return { days, hours: hrs, minutes: mins2, past: false }
}

function CountdownBadge({ date, time }) {
  const [cd, setCd] = useState(() => getCountdown(date, time))
  useEffect(() => {
    const t = setInterval(() => setCd(getCountdown(date, time)), 60000)
    return () => clearInterval(t)
  }, [date, time])
  if (cd.past) return <span className="text-xs text-gray-400 font-medium">Completed</span>
  if (cd.days === 0 && cd.hours === 0) return <span className="text-xs font-bold text-red-500">In {cd.minutes}m</span>
  if (cd.days === 0) return <span className="text-xs font-bold text-red-500">Today in {cd.hours}h {cd.minutes}m</span>
  if (cd.days === 1) return <span className="text-xs font-bold text-amber-600">Tomorrow</span>
  return <span className="text-xs font-semibold text-gray-500">{cd.days} days</span>
}

export default function TimetablePage() {
  const navigate = useNavigate()
  const now = new Date()

  // Group exams by day
  const byDay = {}
  for (const exam of EXAMS) {
    if (!byDay[exam.date]) byDay[exam.date] = []
    byDay[exam.date].push(exam)
  }

  // Find next exam
  const nextExam = EXAMS.find(e => {
    const [h, m] = e.time.split(':').map(Number)
    const d = new Date(e.date)
    d.setHours(h, m, 0, 0)
    return d > now && e.subjectId !== null
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600">←</button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📅 Exam Timetable</h1>
          <p className="text-sm text-gray-500">June Internal Exam Week — 1–5 June 2026</p>
        </div>
      </div>

      {/* Next exam banner */}
      {nextExam && (
        <div className="rounded-2xl p-5 mb-5 text-white shadow-md" style={{ backgroundColor: nextExam.color }}>
          <p className="text-xs font-semibold opacity-80 mb-1">⏰ Next exam</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-black">{nextExam.icon} {nextExam.subject}</p>
              <p className="text-sm opacity-90 mt-0.5">{nextExam.day} at {nextExam.time} — {nextExam.duration}</p>
            </div>
            <div className="text-right">
              <CountdownBadge date={nextExam.date} time={nextExam.time} />
              {nextExam.subjectId && (
                <button
                  onClick={() => navigate(`/subject/${nextExam.subjectId}`)}
                  className="mt-2 block text-xs font-semibold bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-3 py-1.5 transition"
                >
                  Revise →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Timetable */}
      <div className="space-y-3">
        {Object.entries(byDay).map(([date, exams]) => {
          const isPast = new Date(date) < new Date(new Date().toDateString())
          return (
            <div key={date} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${isPast ? 'opacity-60 border-gray-100' : 'border-gray-100'}`}>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-600">{exams[0].day}</p>
              </div>
              {exams.map((exam, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
                  <span className="text-2xl flex-shrink-0">{exam.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{exam.subject}</p>
                    <p className="text-xs text-gray-400">{exam.time} · {exam.duration}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <CountdownBadge date={exam.date} time={exam.time} />
                    {exam.subjectId && !isPast && (
                      <button
                        onClick={() => navigate(`/subject/${exam.subjectId}`)}
                        className="text-xs font-semibold px-2 py-0.5 rounded-lg text-white"
                        style={{ backgroundColor: exam.color }}
                      >
                        Revise →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Exam rules reminder */}
      <div className="mt-4 bg-amber-50 rounded-2xl p-4 border border-amber-100">
        <p className="text-xs font-bold text-amber-800 mb-2">📋 Exam rules reminder</p>
        <ul className="space-y-1">
          {[
            'Bring your own equipment in a clear plastic bag (pen, pencil, ruler, eraser, calculator, compass, protractor)',
            'No phones or watches — all must go in your bag',
            'Only water is allowed in the exam room',
            'You cannot leave early — check and re-check your work',
            'Maths and English are 1.5 hours each — all other exams are 1 hour',
          ].map((rule, i) => (
            <li key={i} className="text-xs text-amber-700 flex gap-2">
              <span className="flex-shrink-0">•</span><span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
