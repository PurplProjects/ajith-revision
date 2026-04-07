import { supabase, STUDENT_ID } from './supabase'
import { getAllQuestions } from '../data/curriculum'

// ─── Seed questions into DB on first load ───────────────────────────────────
export async function seedQuestionsIfNeeded() {
  const { count } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })

  if (count > 0) return // already seeded

  const questions = getAllQuestions().map(q => ({
    id: q.id,
    subject_id: q.subject_id,
    assignment_id: q.assignment_id,
    subject_name: q.subject_name,
    type: q.type,
    question: q.question,
    options: q.options ?? null,
    correct_index: q.correct_index ?? null,
    explanation: q.explanation ?? null,
    extract: q.extract ?? null,
    placeholder: q.placeholder ?? null,
  }))

  await supabase.from('questions').insert(questions)
}

// ─── Time tracking ──────────────────────────────────────────────────────────
export async function startSession(subjectId, topicId) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      student_id: STUDENT_ID,
      subject_id: subjectId,
      topic_id: topicId,
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) { console.error('startSession:', error); return null }
  return data.id
}

export async function endSession(sessionId, durationSeconds) {
  if (!sessionId) return
  await supabase
    .from('sessions')
    .update({
      ended_at: new Date().toISOString(),
      duration_seconds: Math.round(durationSeconds),
    })
    .eq('id', sessionId)
}

// ─── Progress helpers ────────────────────────────────────────────────────────
export async function fetchProgress() {
  const { data: sessions } = await supabase
    .from('sessions')
    .select('subject_id, topic_id, duration_seconds')
    .eq('student_id', STUDENT_ID)
    .not('duration_seconds', 'is', null)

  const { data: submissions } = await supabase
    .from('assignment_submissions')
    .select('subject_id, confidence_rating, submitted_at')
    .eq('student_id', STUDENT_ID)

  // Aggregate time per subject
  const timeBySubject = {}
  const topicsBySubject = {}
  for (const s of sessions ?? []) {
    timeBySubject[s.subject_id] = (timeBySubject[s.subject_id] ?? 0) + (s.duration_seconds ?? 0)
    if (!topicsBySubject[s.subject_id]) topicsBySubject[s.subject_id] = new Set()
    topicsBySubject[s.subject_id].add(s.topic_id)
  }

  // Aggregate submissions per subject
  const submissionsBySubject = {}
  const confidenceBySubject = {}
  for (const sub of submissions ?? []) {
    submissionsBySubject[sub.subject_id] = true
    if (sub.confidence_rating) {
      if (!confidenceBySubject[sub.subject_id]) confidenceBySubject[sub.subject_id] = []
      confidenceBySubject[sub.subject_id].push(sub.confidence_rating)
    }
  }

  return { timeBySubject, topicsBySubject, submissionsBySubject, confidenceBySubject }
}

export async function fetchWeeklyActivity() {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)

  const { data } = await supabase
    .from('sessions')
    .select('started_at, duration_seconds')
    .eq('student_id', STUDENT_ID)
    .gte('started_at', sevenDaysAgo.toISOString())
    .not('duration_seconds', 'is', null)

  // Group by day of week
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const byDay = {}
  for (const s of data ?? []) {
    const day = days[new Date(s.started_at).getDay()]
    byDay[day] = (byDay[day] ?? 0) + Math.round((s.duration_seconds ?? 0) / 60)
  }
  return byDay
}

export async function fetchRecentActivity() {
  const { data } = await supabase
    .from('sessions')
    .select('subject_id, topic_id, started_at, duration_seconds')
    .eq('student_id', STUDENT_ID)
    .not('duration_seconds', 'is', null)
    .order('started_at', { ascending: false })
    .limit(5)
  return data ?? []
}

// ─── Assignment helpers ─────────────────────────────────────────────────────
export async function fetchSubmission(subjectId) {
  const { data } = await supabase
    .from('assignment_submissions')
    .select('*')
    .eq('student_id', STUDENT_ID)
    .eq('subject_id', subjectId)
    .single()
  return data ?? null
}

export async function saveSubmission({ subjectId, assignmentId, answers, confidenceRating }) {
  // Upsert — re-submission overwrites
  const { error } = await supabase
    .from('assignment_submissions')
    .upsert({
      student_id: STUDENT_ID,
      subject_id: subjectId,
      assignment_id: assignmentId,
      answers,
      confidence_rating: confidenceRating,
      submitted_at: new Date().toISOString(),
    }, { onConflict: 'student_id,subject_id' })

  if (error) console.error('saveSubmission:', error)
  return !error
}

// ─── Topic visited marker ────────────────────────────────────────────────────
export async function fetchVisitedTopics() {
  const { data } = await supabase
    .from('sessions')
    .select('topic_id')
    .eq('student_id', STUDENT_ID)
  return new Set((data ?? []).map(s => s.topic_id))
}
