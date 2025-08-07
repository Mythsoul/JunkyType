import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { 
  signIn as authSignIn, 
  signUp as authSignUp, 
  signOut as authSignOut,
  getSession,
  forgotPassword as authForgotPassword,
  resendVerificationEmail as authResendVerificationEmail
} from 'easy.auth98'

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
  registrationComplete: false,
  isAuthModalOpen: false
}

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await authSignIn(email, password)
      if (result.success) {
        const session = await getSession()
        return session.user
      } else {
        return rejectWithValue(result.message)
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, username, emailConfig }, { rejectWithValue }) => {
    try {
      // Pass empty string for applicationUrl and emailConfig as 5th parameter
      const result = await authSignUp(email, password, username, '', emailConfig)
      if (result.success) {
        return result.data || { email, username }
      } else {
        return rejectWithValue(result.message)
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authSignOut()
      if (result.success) {
        return true
      } else {
        return rejectWithValue(result.message)
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      const session = await getSession()
      return session?.user || null
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const result = await authForgotPassword(email)
      if (result.success) {
        return result.message
      } else {
        return rejectWithValue(result.message)
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const resendVerificationEmail = createAsyncThunk(
  'auth/resendVerificationEmail',
  async (email, { rejectWithValue }) => {
    try {
      const result = await authResendVerificationEmail(email)
      if (result.success) {
        return result.message
      } else {
        return rejectWithValue(result.message)
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthModalOpen: (state, action) => {
      state.isAuthModalOpen = action.payload;
    },
    clearError: (state) => {
      state.error = null
    },
    clearRegistrationComplete: (state) => {
      state.registrationComplete = false
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.registrationComplete = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
      
      // Initialize
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = !!action.payload
        state.isInitialized = true
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.isInitialized = true
      })
      
      // Forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Resend verification
      .addCase(resendVerificationEmail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { setAuthModalOpen, clearError, clearRegistrationComplete, setUser } = authSlice.actions
export default authSlice.reducer
