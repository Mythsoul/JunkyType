import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { setAuthModalOpen } from '../../store/slices/authSlice'
import Login from './Login'
import Register from './Register'

function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const dispatch = useDispatch()
  const [mode, setMode] = useState(initialMode)
  const theme = useSelector(state => state.settings.theme)

  useEffect(() => {
    dispatch(setAuthModalOpen(isOpen))
  }, [isOpen, dispatch])

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleSwitchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
  }

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md mx-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute -top-12 right-0 p-2 rounded-full transition-all duration-300 ${
            theme === 'dark'
              ? 'text-white hover:bg-white/10'
              : 'text-white hover:bg-black/10'
          }`}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Auth Form */}
        <div className="w-full">
          {mode === 'login' ? (
            <Login 
              onSwitchToRegister={handleSwitchMode}
              onClose={onClose}
            />
          ) : (
            <Register 
              onSwitchToLogin={handleSwitchMode}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default AuthModal
