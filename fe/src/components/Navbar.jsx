import { Link, NavLink } from "react-router-dom"
import { useSelector } from "react-redux"
import { Keyboard, Trophy, User } from 'lucide-react'

function Navbar() {
  const theme = useSelector((state) => state.settings.theme)

  return (
    <nav
      className={`backdrop-blur-md border-b transition-all duration-300 ${
        theme === "dark" ? "bg-gray-900/80 border-gray-700/50" : "bg-white/80 border-gray-200/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className={`text-2xl font-bold no-underline flex items-center gap-2 transition-colors duration-300 ${
              theme === "dark" ? "text-emerald-400 hover:text-emerald-300" : "text-emerald-600 hover:text-emerald-700"
            }`}
          >
            <Keyboard className="w-8 h-8" />
            <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              JunkeyType
            </span>
          </Link>

          <div className="flex space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium no-underline transition-all duration-300 flex items-center gap-2
                ${
                  isActive
                    ? theme === "dark"
                      ? "bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20"
                      : "bg-emerald-500/10 text-emerald-600 shadow-lg shadow-emerald-500/20"
                    : theme === "dark"
                      ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900"
                }`
              }
            >
              <Keyboard className="w-4 h-4" />
              Practice
            </NavLink>

            <NavLink
              to="/leaderboard"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium no-underline transition-all duration-300 flex items-center gap-2
                ${
                  isActive
                    ? theme === "dark"
                      ? "bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20"
                      : "bg-emerald-500/10 text-emerald-600 shadow-lg shadow-emerald-500/20"
                    : theme === "dark"
                      ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900"
                }`
              }
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium no-underline transition-all duration-300 flex items-center gap-2
                ${
                  isActive
                    ? theme === "dark"
                      ? "bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20"
                      : "bg-emerald-500/10 text-emerald-600 shadow-lg shadow-emerald-500/20"
                    : theme === "dark"
                      ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900"
                }`
              }
            >
              <User className="w-4 h-4" />
              Profile
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar