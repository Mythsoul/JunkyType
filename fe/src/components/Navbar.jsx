import { Link, NavLink } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useState, useRef, useEffect } from 'react'
import { Keyboard, Trophy, User, LogOut, Settings, ChevronDown, Brain } from 'lucide-react'
import { logoutUser } from '../store/slices/authSlice'
import AuthModal from './auth/AuthModal'
import { toast } from 'react-toastify'

function Navbar() {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.settings.theme)
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login')
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const dropdownRef = useRef(null)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const handleLogin = () => {
    setAuthModalMode('login')
    setShowAuthModal(true)
  }
  
  const handleRegister = () => {
    setAuthModalMode('register')
    setShowAuthModal(true)
  }
  
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      setShowUserDropdown(false)
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

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

          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
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
                to="/ai-analysis"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium no-underline transition-all duration-300 flex items-center gap-2
                  ${
                    isActive
                      ? theme === "dark"
                        ? "bg-purple-500/20 text-purple-400 shadow-lg shadow-purple-500/20"
                        : "bg-purple-500/10 text-purple-600 shadow-lg shadow-purple-500/20"
                      : theme === "dark"
                        ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900"
                  }`
                }
              >
                <Brain className="w-4 h-4" />
                AI Analysis
              </NavLink>


              {isAuthenticated && (
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
              )}
            </div>

            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    theme === "dark"
                      ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    theme === "dark" ? "bg-emerald-500/20" : "bg-emerald-500/10"
                  }`}>
                    <User className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-sm font-medium">{user?.username}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    showUserDropdown ? "rotate-180" : ""
                  }`} />
                </button>

                {/* User Dropdown */}
                {showUserDropdown && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border transition-all duration-300 z-50 ${
                    theme === "dark"
                      ? "bg-gray-800/95 backdrop-blur-md border-gray-700/50"
                      : "bg-white/95 backdrop-blur-md border-gray-200/50"
                  }`}>
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                          theme === "dark"
                            ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                            : "text-gray-700 hover:bg-gray-100/50 hover:text-gray-900"
                        }`}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      
                      <Link
                        to="/ai-analysis"
                        onClick={() => setShowUserDropdown(false)}
                        className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                          theme === "dark"
                            ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                            : "text-gray-700 hover:bg-gray-100/50 hover:text-gray-900"
                        }`}
                      >
                        <Brain className="w-4 h-4" />
                        AI Analysis
                      </Link>
                      
                      <Link
                        to="/settings"
                        onClick={() => setShowUserDropdown(false)}
                        className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                          theme === "dark"
                            ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                            : "text-gray-700 hover:bg-gray-100/50 hover:text-gray-900"
                        }`}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      
                      <div className={`h-px my-2 ${
                        theme === "dark" ? "bg-gray-700/50" : "bg-gray-200/50"
                      }`} />
                      
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors ${
                          theme === "dark"
                            ? "text-red-400 hover:bg-red-500/10"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLogin}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    theme === "dark"
                      ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900"
                  }`}
                >
                  Sign In
                </button>
                
                <button
                  onClick={handleRegister}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/25"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Auth Modal */}
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialMode={authModalMode}
          />
        </div>
      </div>
    </nav>
  )
}

export default Navbar