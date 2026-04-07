import { useEffect, useRef, useState } from 'react'
import { startSession, endSession } from '../lib/db'

export function useSessionTimer(subjectId, topicId) {
  const [elapsed, setElapsed] = useState(0)
  const sessionIdRef = useRef(null)
  const startTimeRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!subjectId || !topicId) return

    // Start a session in Supabase
    startSession(subjectId, topicId).then(id => {
      sessionIdRef.current = id
    })
    startTimeRef.current = Date.now()

    // Tick every second
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)

    // On unmount: end session
    return () => {
      clearInterval(intervalRef.current)
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
      endSession(sessionIdRef.current, duration)
    }
  }, [subjectId, topicId])

  const formatElapsed = () => {
    const m = Math.floor(elapsed / 60)
    const s = elapsed % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  return { elapsed, formatted: formatElapsed() }
}
