import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Revision plan data ─────────────────────────────────────────────────────
// Subjects with exams, priority weighting and color
const EXAM_SUBJECTS = [
  { id: 'biology',   name: 'Biology',    icon: '🧬', color: '#1D9E75', examDate: '2026-06-01', grade: 6, weight: 3 },
  { id: 'history',   name: 'History',    icon: '🏛️', color: '#D85A30', examDate: '2026-06-01', grade: 7, weight: 2 },
  { id: 'english',   name: 'English',    icon: '✏️', color: '#378ADD', examDate: '2026-06-02', grade: 7, weight: 3 },
  { id: 'physics',   name: 'Physics',    icon: '⚡', color: '#D85A30', examDate: '2026-06-02', grade: 6, weight: 3 },
  { id: 'chemistry', name: 'Chemistry',  icon: '⚗️', color: '#7F77DD', examDate: '2026-06-04', grade: 7, weight: 3 },
  { id: 'tp',        name: 'T&P',        icon: '✡️', color: '#7C3AED', examDate: '2026-06-04', grade: 6, weight: 2 },
  { id: 'geography', name: 'Geography',  icon: '🌍', color: '#1D9E75', examDate: '2026-06-05', grade: 7, weight: 2 },
  { id: 'maths',     name: 'Maths',      icon: '➕', color: '#BA7517', examDate: '2026-06-05', grade: 7, weight: 3 },
  { id: 'spanish',   name: 'Spanish',    icon: '🇪🇸', color: '#D85A30', examDate: null,         grade: 6, weight: 2 },
  { id: 'mandarin',  name: 'Mandarin',   icon: '🇨🇳', color: '#D85A30', examDate: null,         grade: 5, weight: 3 },
  { id: 'latin',     name: 'Latin',      icon: '🏺', color: '#888780', examDate: null,          grade: 6, weight: 2 },
]

// ── Generate revision plan ─────────────────────────────────────────────────
function generatePlan() {
  const plan = {}

  // Date range: 9 May to 5 June 2026
  const start = new Date('2026-05-09')
  const end   = new Date('2026-06-05')

  // Define daily budgets
  function getBudget(date) {
    const d = date.toISOString().split('T')[0]
    const day = date.getDay() // 0=Sun, 6=Sat
    // Half term: 24 May (Sat) to 1 Jun (Sun)
    const isHalfTerm = d >= '2026-05-24' && d <= '2026-06-01'
    const isExamWeek = d >= '2026-06-01' && d <= '2026-06-05'
    if (isHalfTerm) return 360 // 6 hours
    if (isExamWeek) return 60  // 1 hour revision before exam
    if (day === 6) return 60   // Saturday 9/16 May = 1 hour
    if (day === 0) return 120  // Sunday = 2 hours
    return 30                  // Weekday = 30 min
  }

  // For each day, assign subjects based on what exams are coming up
  let current = new Date(start)
  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0]
    const budget  = getBudget(current)
    const isExamWeek = dateStr >= '2026-06-01'

    // Which subjects are relevant? Priority: upcoming exam subjects, then weaker grades
    // Filter to subjects whose exam hasn't passed yet
    const available = EXAM_SUBJECTS.filter(s => {
      if (!s.examDate) return dateStr < '2026-06-01' // no-exam subjects only in pre-half-term
      return s.examDate >= dateStr
    })

    // Sort by days until exam (soonest first), then by weight (higher = more time)
    available.sort((a, b) => {
      const daysA = a.examDate ? (new Date(a.examDate) - current) / 86400000 : 999
      const daysB = b.examDate ? (new Date(b.examDate) - current) / 86400000 : 999
      if (Math.abs(daysA - daysB) < 3) return b.weight - a.weight
      return daysA - daysB
    })

    // Assign time slots
    const slots = []
    let remaining = budget

    if (budget === 30) {
      // Weekday: one subject — highest priority
      if (available[0]) slots.push({ ...available[0], minutes: 30, type: 'mixed' })
    } else if (budget === 60) {
      // 1 hour: 2 subjects × 30 min
      const pick = available.slice(0, 2)
      for (const s of pick) {
        if (remaining >= 30) { slots.push({ ...s, minutes: 30, type: 'mixed' }); remaining -= 30 }
      }
    } else {
      // 2+ hours: distribute across subjects with weighting
      // First pass: assign 30 min to top 3 by priority
      const top = available.slice(0, Math.min(available.length, Math.floor(budget / 30)))
      for (const s of top) {
        if (remaining >= 30) {
          const mins = Math.min(remaining, s.weight * 30)
          const rounded = Math.ceil(mins / 30) * 30
          slots.push({ ...s, minutes: Math.min(rounded, 60), type: remaining > 120 ? 'mixed' : 'mixed' })
          remaining -= Math.min(rounded, 60)
        }
        if (remaining <= 0) break
      }
    }

    plan[dateStr] = { date: dateStr, budget, slots, notes: '', completed: {} }
    current.setDate(current.getDate() + 1)
  }
  return plan
}

const DEFAULT_PLAN = generatePlan()
const STORAGE_KEY  = 'ajith-revision-plan-v1'

function loadPlan() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return { ...DEFAULT_PLAN, ...JSON.parse(saved) }
  } catch {}
  return DEFAULT_PLAN
}

// ── Component ──────────────────────────────────────────────────────────────
export default function RevisionPlanPage() {
  const navigate  = useNavigate()
  const [plan, setPlan] = useState(loadPlan)
  const [selectedDate, setSelectedDate] = useState(null)
  const [view, setView] = useState('week') // week | day

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(plan)) } catch {}
  }, [plan])

  function toggleComplete(date, subjectId) {
    setPlan(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        completed: {
          ...prev[date]?.completed,
          [subjectId]: !prev[date]?.completed?.[subjectId],
        },
      },
    }))
  }

  function updateNotes(date, notes) {
    setPlan(prev => ({ ...prev, [date]: { ...prev[date], notes } }))
  }

  function updateSlotMinutes(date, subjectId, minutes) {
    setPlan(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        slots: prev[date].slots.map(s => s.id === subjectId ? { ...s, minutes } : s),
      },
    }))
  }

  // ── Week view ──────────────────────────────────────────────────────────
  const weeks = []
  const allDates = Object.keys(plan).sort()
  for (let i = 0; i < allDates.length; i += 7) {
    weeks.push(allDates.slice(i, i + 7))
  }

  const today = new Date().toISOString().split('T')[0]

  function formatDate(d) {
    return new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  function isHalfTerm(d) { return d >= '2026-05-24' && d <= '2026-06-01' }
  function isExamDay(d)   { return ['2026-06-01','2026-06-02','2026-06-04','2026-06-05'].includes(d) }

  const selectedDay = selectedDate ? plan[selectedDate] : null

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600">←</button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📚 Revision Plan</h1>
          <p className="text-sm text-gray-500">9 May – 5 June 2026</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-3 mb-4 flex-wrap text-xs">
        {[
          { label: 'Weekday (30 min)', color: '#f9fafb', border: '#e5e7eb' },
          { label: 'Weekend (1–2 hrs)', color: '#eff6ff', border: '#bfdbfe' },
          { label: 'Half term (6 hrs/day)', color: '#f0fdf4', border: '#86efac' },
          { label: 'Exam week', color: '#fef3c7', border: '#fcd34d' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border" style={{ backgroundColor: l.color, borderColor: l.border }} />
            <span className="text-gray-600">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Week grid */}
      <div className="space-y-4">
        {weeks.map((week, wi) => (
          <div key={wi}>
            <div className="grid grid-cols-7 gap-1.5">
              {week.map(date => {
                const day = plan[date]
                if (!day) return <div key={date} />
                const isToday = date === today
                const isPast = date < today
                const halfTerm = isHalfTerm(date)
                const examDay = isExamDay(date)
                const dow = new Date(date).getDay()
                const isWeekend = dow === 0 || dow === 6
                const completedCount = Object.values(day.completed ?? {}).filter(Boolean).length
                const totalSlots = day.slots?.length ?? 0
                const allDone = totalSlots > 0 && completedCount === totalSlots

                let bg = '#f9fafb', border = '#e5e7eb'
                if (halfTerm) { bg = '#f0fdf4'; border = '#86efac' }
                else if (examDay) { bg = '#fef3c7'; border = '#fcd34d' }
                else if (isWeekend) { bg = '#eff6ff'; border = '#bfdbfe' }
                if (isToday) { border = '#6366f1' }
                if (allDone) { bg = '#dcfce7'; border = '#4ade80' }

                return (
                  <button
                    key={date}
                    onClick={() => { setSelectedDate(date); setView('day') }}
                    className="rounded-xl p-2 text-left transition hover:shadow-sm"
                    style={{ backgroundColor: bg, border: `2px solid ${border}`, opacity: isPast ? 0.6 : 1 }}
                  >
                    <p className={`text-xs font-bold mb-1 ${isToday ? 'text-indigo-600' : 'text-gray-600'}`}>
                      {new Date(date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}
                    </p>
                    {day.slots?.slice(0, 3).map((s, i) => (
                      <div key={i} className="flex items-center gap-0.5 mb-0.5">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="text-xs truncate text-gray-600" style={{ fontSize: '9px' }}>{s.name}</span>
                      </div>
                    ))}
                    {totalSlots > 0 && (
                      <p className="text-xs text-gray-400 mt-0.5" style={{ fontSize: '9px' }}>
                        {allDone ? '✓ Done' : `${completedCount}/${totalSlots}`} · {day.budget}m
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Day detail panel */}
      {selectedDate && selectedDay && view === 'day' && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end justify-center" onClick={() => setView('week')}>
          <div
            className="bg-white rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">{formatDate(selectedDate)}</h2>
                <p className="text-sm text-gray-500">
                  {isHalfTerm(selectedDate) ? '🌿 Half term — 6 hours available' :
                   isExamDay(selectedDate) ? '📝 Exam day' :
                   `${selectedDay.budget} minutes revision`}
                </p>
              </div>
              <button onClick={() => setView('week')} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            {selectedDay.slots?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No revision scheduled for this day.</p>
            ) : (
              <div className="space-y-3">
                {selectedDay.slots?.map((slot, i) => {
                  const done = selectedDay.completed?.[slot.id]
                  return (
                    <div key={i} className={`rounded-xl p-4 border-2 transition ${done ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleComplete(selectedDate, slot.id)}
                          className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}
                        >
                          {done && <span className="text-xs">✓</span>}
                        </button>
                        <span className="text-xl">{slot.icon}</span>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${done ? 'line-through text-gray-400' : 'text-gray-800'}`}>{slot.name}</p>
                          <p className="text-xs text-gray-400">{slot.minutes} minutes · {slot.type === 'mixed' ? 'Flashcards + test' : 'Flashcards'}</p>
                        </div>
                        <select
                          value={slot.minutes}
                          onChange={e => updateSlotMinutes(selectedDate, slot.id, Number(e.target.value))}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600"
                        >
                          {[15,20,25,30,45,60,90].map(m => <option key={m} value={m}>{m}m</option>)}
                        </select>
                      </div>
                      <div className="mt-2 ml-9 flex gap-2">
                        <button
                          onClick={() => navigate(`/subject/${slot.id}`)}
                          className="text-xs font-semibold px-2 py-1 rounded-lg text-white hover:opacity-90"
                          style={{ backgroundColor: slot.color }}
                        >
                          📖 Notes
                        </button>
                        <button
                          onClick={() => navigate(`/subject/${slot.id}/test`)}
                          className="text-xs font-semibold px-2 py-1 rounded-lg border text-gray-600 hover:bg-gray-50"
                        >
                          ✏️ Test
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Notes */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 mb-1">Notes for this day</p>
              <textarea
                value={selectedDay.notes ?? ''}
                onChange={e => updateNotes(selectedDate, e.target.value)}
                placeholder="Add notes or changes to the plan..."
                className="w-full text-xs border border-gray-200 rounded-xl p-3 text-gray-700 resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
