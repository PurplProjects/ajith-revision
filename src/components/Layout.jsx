import { Outlet, useNavigate, useLocation } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { path: '/',          label: 'Home',     icon: '🏠' },
    { path: '/plan',      label: 'Plan',     icon: '📚' },
    { path: '/timetable', label: 'Exams',    icon: '📅' },
    { path: '/progress',  label: 'Progress', icon: '📈' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <span className="font-bold text-gray-900 text-sm">Ajith's Revision Hub</span>
          </button>
          <a href="/parent" className="text-xs text-indigo-600 font-medium hover:text-indigo-800">
            Parent View →
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-5 pb-24">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-10">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-around">
          {navItems.map(item => {
            const active = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${
                  active ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
