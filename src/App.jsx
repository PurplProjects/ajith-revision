import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import SubjectPage from './pages/SubjectPage'
import AssignmentPage from './pages/AssignmentPage'
import ProgressPage from './pages/ProgressPage'
import ParentDashboard from './pages/ParentDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/parent" element={<ParentDashboard />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/subject/:subjectId" element={<SubjectPage />} />
          <Route path="/subject/:subjectId/test" element={<AssignmentPage />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
