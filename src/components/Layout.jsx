import { Outlet, NavLink, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80">
            <span className="text-2xl">🎓</span>
            <span className="font-bold text-gray-800 text-lg">Ajith's Revision Hub</span>
          </button>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={({isActive}) =>
              `px-3 py-1.5 rounded-lg text-sm font-medium transition ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`
            }>Home</NavLink>
            <NavLink to="/progress" className={({isActive}) =>
              `px-3 py-1.5 rounded-lg text-sm font-medium transition ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`
            }>Progress</NavLink>
            <a href="/parent" target="_blank" className="px-3 py-1.5 rounded-lg text-sm font-medium text-purple-600 hover:bg-purple-50 transition">
              👨‍👩‍👦 Parent View
            </a>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
