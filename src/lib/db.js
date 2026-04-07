import { supabase, STUDENT_ID } from './supabase'
import { SUBJECTS, getAllQuestions } from '../data/curriculum'

// ─── Seed questions on first load ────────────────────────────────────────────
export async function seedQuestionsIfNeeded() {
  const { count } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })

  if (count > 0) return

  const questions = getAllQuestions().map(q => ({
    id:            q.id,
    subject_id:    q.subject_id,
    subject_name:  q.subject_name,
    topic:         q.topic,
    difficulty:    q.difficulty,
    type:          q.type,
    question:      q.question,
    options:       q.options ?? null,
    correct_index: q.correct_index ?? null,
    explanation:   q.explanation ?? null,
    extract:       q.extract ?? null,
    placeholder:   q.placeholder ?? null,
  }))

  // Insert in batches of 100 to avoid request size limits
  for (let i = 0; i < questions.length; i += 100) {
    await supabase.from('questions').insert(questions.slice(i, i + 100))
  }
}

// ─── Smart question selection ─────────────────────────────────────────────────
// Picks 10 least-shown questions for a subject, random within same show count
export async function selectQuestionsForTest(subjectId) {
  // Fetch all questions for subject
  const { data: allQuestions, error: qErr } = await supabase
    .from('questions')
    .select('*')
    .eq('subject_id', subjectId)

  if (qErr || !allQuestions?.length) return []

  // Fetch existing exposures for this student
  const questionIds = allQuestions.map(q => q.id)
  const { data: exposures } = await supabase
    .from('question_exposures')
    .select('question_id, shown_count')
    .eq('student_id', STUDENT_ID)
    .in('question_id', questionIds)

  const exposureMap = {}
  for (const e of exposures ?? []) {
    exposureMap[e.question_id] = e.shown_count
  }

  // Attach show count to each question (default 0 if never shown)
  const withCounts = allQuestions.map(q => ({
    ...q,
    shown_count: exposureMap[q.id] ?? 0,
  }))

  // Sort by shown_count ascending, shuffle within same count (Fisher-Yates)
  const groups = {}
  for (const q of withCounts) {
    if (!groups[q.shown_count]) groups[q.shown_count] = []
    groups[q.shown_count].push(q)
  }

  const sorted = []
  for (const count of Object.keys(groups).map(Number).sort((a, b) => a - b)) {
    const group = groups[count]
    // Shuffle group
    for (let i = group.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [group[i], group[j]] = [group[j], group[i]]
    }
    sorted.push(...group)
  }

  return sorted.slice(0, 10)
}

// ─── Log that questions were shown ───────────────────────────────────────────
export async function logQuestionExposures(questionIds) {
  // For each question, upsert: if exists increment count, else insert with count=1
  for (const qid of questionIds) {
    const { data: existing } = await supabase
      .from('question_exposures')
      .select('id, shown_count')
      .eq('question_id', qid)
      .eq('student_id', STUDENT_ID)
      .single()

    if (existing) {
      await supabase
        .from('question_exposures')
        .update({ shown_count: existing.shown_count + 1, last_shown_at: new Date().toISOString() })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('question_exposures')
        .insert({ question_id: qid, student_id: STUDENT_ID, shown_count: 1 })
    }
  }
}

// ─── Get next attempt number for a subject ────────────────────────────────────
export async function getNextAttemptNumber(subjectId) {
  const { count } = await supabase
    .from('assignment_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', STUDENT_ID)
    .eq('subject_id', subjectId)
  return (count ?? 0) + 1
}

// ─── Save assignment submission ───────────────────────────────────────────────
export async function saveSubmission({ subjectId, subjectName, attemptNumber, questionsShown, answers, score, mcTotal, confidenceRating }) {
  const { error } = await supabase
    .from('assignment_submissions')
    .insert({
      student_id:        STUDENT_ID,
      subject_id:        subjectId,
      subject_name:      subjectName,
      attempt_number:    attemptNumber,
      questions_shown:   questionsShown,
      answers,
      score,
      mc_total:          mcTotal,
      confidence_rating: confidenceRating,
      submitted_at:      new Date().toISOString(),
    })
  if (error) console.error('saveSubmission:', error)
  return !error
}

// ─── Fetch all submissions for a subject ─────────────────────────────────────
export async function fetchSubjectSubmissions(subjectId) {
  const { data } = await supabase
    .from('assignment_submissions')
    .select('*')
    .eq('student_id', STUDENT_ID)
    .eq('subject_id', subjectId)
    .order('attempt_number', { ascending: true })
  return data ?? []
}

// ─── Fetch all submissions (for parent dashboard) ─────────────────────────────
export async function fetchAllSubmissions() {
  const { data } = await supabase
    .from('assignment_submissions')
    .select('*')
    .eq('student_id', STUDENT_ID)
    .order('submitted_at', { ascending: false })
  return data ?? []
}

// ─── Fetch exposure stats (how many unique questions seen per subject) ────────
export async function fetchExposureStats() {
  const { data } = await supabase
    .from('question_exposures')
    .select('question_id')
    .eq('student_id', STUDENT_ID)
    .gt('shown_count', 0)
  return data?.length ?? 0
}

export async function fetchExposuresBySubject() {
  const { data: exposures } = await supabase
    .from('question_exposures')
    .select('question_id')
    .eq('student_id', STUDENT_ID)

  const { data: questions } = await supabase
    .from('questions')
    .select('id, subject_id')

  if (!questions) return {}

  const exposedIds = new Set((exposures ?? []).map(e => e.question_id))
  const result = {}
  for (const q of questions) {
    if (!result[q.subject_id]) result[q.subject_id] = { seen: 0, total: 0 }
    result[q.subject_id].total++
    if (exposedIds.has(q.id)) result[q.subject_id].seen++
  }
  return result
}

// ─── Sessions ────────────────────────────────────────────────────────────────
export async function startSession(subjectId, topicId) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ student_id: STUDENT_ID, subject_id: subjectId, topic_id: topicId, started_at: new Date().toISOString() })
    .select()
    .single()
  if (error) { console.error('startSession:', error); return null }
  return data.id
}

export async function endSession(sessionId, durationSeconds) {
  if (!sessionId) return
  await supabase
    .from('sessions')
    .update({ ended_at: new Date().toISOString(), duration_seconds: Math.round(durationSeconds) })
    .eq('id', sessionId)
}

export async function fetchVisitedTopics() {
  const { data } = await supabase
    .from('sessions')
    .select('topic_id')
    .eq('student_id', STUDENT_ID)
  return new Set((data ?? []).map(s => s.topic_id))
}

// ─── Progress summary ─────────────────────────────────────────────────────────
export async function fetchProgress() {
  const { data: sessions } = await supabase
    .from('sessions')
    .select('subject_id, topic_id, duration_seconds')
    .eq('student_id', STUDENT_ID)
    .not('duration_seconds', 'is', null)

  const { data: submissions } = await supabase
    .from('assignment_submissions')
    .select('subject_id, score, mc_total, confidence_rating, attempt_number')
    .eq('student_id', STUDENT_ID)

  const timeBySubject = {}
  const topicsBySubject = {}
  for (const s of sessions ?? []) {
    timeBySubject[s.subject_id] = (timeBySubject[s.subject_id] ?? 0) + (s.duration_seconds ?? 0)
    if (!topicsBySubject[s.subject_id]) topicsBySubject[s.subject_id] = new Set()
    topicsBySubject[s.subject_id].add(s.topic_id)
  }

  const attemptsBySubject = {}
  const scoresBySubject = {}
  const confidenceBySubject = {}
  for (const sub of submissions ?? []) {
    attemptsBySubject[sub.subject_id] = (attemptsBySubject[sub.subject_id] ?? 0) + 1
    if (sub.score !== null && sub.mc_total) {
      if (!scoresBySubject[sub.subject_id]) scoresBySubject[sub.subject_id] = []
      scoresBySubject[sub.subject_id].push({ score: sub.score, total: sub.mc_total, attempt: sub.attempt_number })
    }
    if (sub.confidence_rating) {
      if (!confidenceBySubject[sub.subject_id]) confidenceBySubject[sub.subject_id] = []
      confidenceBySubject[sub.subject_id].push(sub.confidence_rating)
    }
  }

  return { timeBySubject, topicsBySubject, attemptsBySubject, scoresBySubject, confidenceBySubject }
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
