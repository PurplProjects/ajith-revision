import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import SubjectPage from './pages/SubjectPage'
import AssignmentPage from './pages/AssignmentPage'
import ProgressPage from './pages/ProgressPage'
import Layout from './components/Layout'
import { seedQuestionsIfNeeded } from './lib/db'

export default function App() {
  useEffect(() => {
    seedQuestionsIfNeeded()
  }, [])

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/subject/:subjectId" element={<SubjectPage />} />
          <Route path="/subject/:subjectId/assignment" element={<AssignmentPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
