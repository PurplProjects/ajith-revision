import { supabase, STUDENT_ID } from './supabase'
import { getAllQuestions } from '../data/curriculum'

// ─── Seed questions — checks per subject so new subjects can be added ─────────
// This means adding CS questions won't affect Ajith's existing progress at all
export async function seedQuestionsIfNeeded() {
  const { data: existingSubjects } = await supabase
    .from('questions')
    .select('subject_id')

  const seededSubjectIds = new Set((existingSubjects ?? []).map(q => q.subject_id))

  const allQuestions = getAllQuestions()

  // Group questions by subject
  const bySubject = {}
  for (const q of allQuestions) {
    if (!bySubject[q.subject_id]) bySubject[q.subject_id] = []
    bySubject[q.subject_id].push(q)
  }

  // Only insert questions for subjects not already in the database
  for (const [subjectId, questions] of Object.entries(bySubject)) {
    if (seededSubjectIds.has(subjectId)) continue  // already seeded — skip

    const rows = questions.map(q => ({
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

    // Insert in batches of 100
    for (let i = 0; i < rows.length; i += 100) {
      const { error } = await supabase.from('questions').insert(rows.slice(i, i + 100))
      if (error) console.error(`Seeding error for ${subjectId}:`, error)
    }

    console.log(`Seeded ${rows.length} questions for ${subjectId}`)
  }
}

// ─── Smart question selection ──────────────────────────────────────────────────
export async function selectQuestionsForTest(subjectId) {
  const { data: allQuestions, error: qErr } = await supabase
    .from('questions')
    .select('*')
    .eq('subject_id', subjectId)

  if (qErr || !allQuestions?.length) return []

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

  const withCounts = allQuestions.map(q => ({
    ...q,
    shown_count: exposureMap[q.id] ?? 0,
  }))

  const groups = {}
  for (const q of withCounts) {
    if (!groups[q.shown_count]) groups[q.shown_count] = []
    groups[q.shown_count].push(q)
  }

  const sorted = []
  for (const count of Object.keys(groups).map(Number).sort((a, b) => a - b)) {
    const group = groups[count]
    for (let i = group.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [group[i], group[j]] = [group[j], group[i]]
    }
    sorted.push(...group)
  }

  return sorted.slice(0, 10)
}

// ─── Log exposures ────────────────────────────────────────────────────────────
export async function logQuestionExposures(questionIds) {
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

// ─── Attempt number ───────────────────────────────────────────────────────────
export async function getNextAttemptNumber(subjectId) {
  const { count } = await supabase
    .from('assignment_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', STUDENT_ID)
    .eq('subject_id', subjectId)
  return (count ?? 0) + 1
}

// ─── Save submission ──────────────────────────────────────────────────────────
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

// ─── Update submission score (parent grading) ─────────────────────────────────
export async function updateSubmissionScore(submissionId, newScore, newTotal) {
  const update = { score: newScore }
  if (newTotal !== undefined) update.mc_total = newTotal
  const { error } = await supabase
    .from('assignment_submissions')
    .update(update)
    .eq('id', submissionId)
  if (error) console.error('updateSubmissionScore:', error)
  return !error
}

// ─── Fetch submission with full question data ─────────────────────────────────
export async function fetchSubmissionWithQuestions(submissionId) {
  const { data: submission, error } = await supabase
    .from('assignment_submissions')
    .select('*')
    .eq('id', submissionId)
    .single()

  if (error || !submission) return null

  const questionIds = submission.questions_shown ?? []
  if (questionIds.length === 0) return { submission, questions: [] }

  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .in('id', questionIds)

  const qMap = {}
  for (const q of questions ?? []) qMap[q.id] = q
  const orderedQuestions = questionIds.map(id => qMap[id]).filter(Boolean)

  return { submission, questions: orderedQuestions }
}

// ─── Fetch submissions ────────────────────────────────────────────────────────
export async function fetchSubjectSubmissions(subjectId) {
  const { data } = await supabase
    .from('assignment_submissions')
    .select('*')
    .eq('student_id', STUDENT_ID)
    .eq('subject_id', subjectId)
    .order('attempt_number', { ascending: true })
  return data ?? []
}

export async function fetchAllSubmissions() {
  const { data } = await supabase
    .from('assignment_submissions')
    .select('*')
    .eq('student_id', STUDENT_ID)
    .order('submitted_at', { ascending: false })
  return data ?? []
}

// ─── Exposures ────────────────────────────────────────────────────────────────
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

// ─── Sessions ─────────────────────────────────────────────────────────────────
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
  if (!sessionId || durationSeconds === undefined) return
  const rounded = Math.max(1, Math.round(durationSeconds))
  const { error } = await supabase
    .from('sessions')
    .update({ ended_at: new Date().toISOString(), duration_seconds: rounded })
    .eq('id', sessionId)
  if (error) console.error('endSession:', error)
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
    .gt('duration_seconds', 0)

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
