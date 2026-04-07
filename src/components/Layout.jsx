import { Link, useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-900">Ajith's Revision Hub</span>
            <span className="text-xs text-gray-400 hidden sm:inline">Brentwood School · Year 7</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === '/' ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/progress"
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === '/progress' ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Progress
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
