import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Eye, EyeOff, Mail, Lock, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { registerUser, clearError, clearRegistrationComplete } from '../../store/slices/authSlice'
import { toast } from 'react-toastify'

function Register({ onSwitchToLogin, onClose }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [enableEmailVerification, setEnableEmailVerification] = useState(true)
  const [errors, setErrors] = useState({})

  const dispatch = useDispatch()
  const { isLoading, error, registrationComplete } = useSelector(state => state.auth)
  const theme = useSelector(state => state.settings.theme)

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    dispatch(clearError())
    
    try {
      const result = await dispatch(registerUser({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        emailConfig: { sendVerificationEmail: enableEmailVerification }
      })).unwrap()
      
      if (enableEmailVerification) {
        toast.success('Registration successful! Please check your email to verify your account.')
      } else {
        toast.success('Registration successful! You can now sign in.')
      }
    } catch (error) {
      toast.error(error || 'Registration failed. Please try again.')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSwitchToLogin = () => {
    dispatch(clearRegistrationComplete())
    onSwitchToLogin()
  }

  const inputBaseClass = `w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 ${
    theme === 'dark'
      ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-emerald-500 focus:bg-gray-800'
      : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500 focus:bg-white'
  } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`

  const errorInputClass = `border-red-500 focus:border-red-500 focus:ring-red-500/20`

  // Show success message if registration is complete
  if (registrationComplete) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className={`backdrop-blur-md rounded-2xl p-8 border transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-gray-900/80 border-gray-700/50'
            : 'bg-white/80 border-gray-200/50'
        } shadow-2xl`}>
          
          <div className="text-center">
            <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            
            <h2 className={`text-3xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Registration Successful!
            </h2>
            
            <p className={`mb-6 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {enableEmailVerification 
                ? 'We\'ve sent a verification email to your inbox. Please check your email and click the verification link to activate your account.'
                : 'Your account has been created successfully. You can now sign in with your credentials.'
              }
            </p>
            
            <button
              onClick={handleSwitchToLogin}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/25"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className={`backdrop-blur-md rounded-2xl p-8 border transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gray-900/80 border-gray-700/50'
          : 'bg-white/80 border-gray-200/50'
      } shadow-2xl`}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Create Account
          </h2>
          <p className={`${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Join JunkeyType to track your progress
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
            theme === 'dark'
              ? 'bg-red-900/20 border-red-800/50 text-red-300'
              : 'bg-red-50/80 border-red-200 text-red-700'
          }`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <User className={`w-5 h-5 ${
                errors.username
                  ? 'text-red-500'
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className={`${inputBaseClass} ${errors.username ? errorInputClass : ''}`}
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-2 ml-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Mail className={`w-5 h-5 ${
                errors.email
                  ? 'text-red-500'
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              className={`${inputBaseClass} ${errors.email ? errorInputClass : ''}`}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2 ml-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Lock className={`w-5 h-5 ${
                errors.password
                  ? 'text-red-500'
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={`${inputBaseClass} pr-12 ${errors.password ? errorInputClass : ''}`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              } transition-colors`}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-2 ml-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Lock className={`w-5 h-5 ${
                errors.confirmPassword
                  ? 'text-red-500'
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`${inputBaseClass} pr-12 ${errors.confirmPassword ? errorInputClass : ''}`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              } transition-colors`}
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-2 ml-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Email Verification Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="emailVerification"
              checked={enableEmailVerification}
              onChange={(e) => setEnableEmailVerification(e.target.checked)}
              className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
              disabled={isLoading}
            />
            <label
              htmlFor="emailVerification"
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Enable email verification (recommended)
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <div className={`text-center mt-8 pt-6 border-t ${
          theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
        }`}>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className={`font-semibold hover:underline transition-colors ${
                theme === 'dark'
                  ? 'text-emerald-400 hover:text-emerald-300'
                  : 'text-emerald-600 hover:text-emerald-700'
              }`}
              disabled={isLoading}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
