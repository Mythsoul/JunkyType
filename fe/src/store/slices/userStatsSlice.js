import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Mock API functions - in a real app, these would be API calls
const mockAPI = {
  saveTestResult: async (testResult) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Get existing results from localStorage
    const existingResults = JSON.parse(localStorage.getItem('typingResults') || '[]')
    const newResult = {
      ...testResult,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    }
    
    const updatedResults = [newResult, ...existingResults].slice(0, 100) // Keep last 100 results
    localStorage.setItem('typingResults', JSON.stringify(updatedResults))
    
    return newResult
  },
  
  getUserStats: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const results = JSON.parse(localStorage.getItem('typingResults') || '[]')
    
    if (results.length === 0) {
      return {
        testsCompleted: 0,
        avgWpm: 0,
        bestWpm: 0,
        avgAccuracy: 0,
        bestAccuracy: 0,
        totalTimeTyping: 0,
        recentResults: [],
        rank: null,
        percentile: 0
      }
    }
    
    const wpmValues = results.map(r => r.wpm).filter(wpm => wpm > 0)
    const accuracyValues = results.map(r => r.accuracy).filter(acc => acc > 0)
    
    return {
      testsCompleted: results.length,
      avgWpm: Math.round(wpmValues.reduce((sum, wpm) => sum + wpm, 0) / wpmValues.length),
      bestWpm: Math.max(...wpmValues),
      avgAccuracy: Math.round(accuracyValues.reduce((sum, acc) => sum + acc, 0) / accuracyValues.length),
      bestAccuracy: Math.max(...accuracyValues),
      totalTimeTyping: results.reduce((sum, r) => sum + (r.timeSeconds || 0), 0),
      recentResults: results.slice(0, 10),
      rank: Math.floor(Math.random() * 1000) + 1, // Mock rank
      percentile: Math.floor(Math.random() * 100) + 1 // Mock percentile
    }
  },
  
  getLeaderboard: async () => {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Generate mock leaderboard data
    const mockLeaderboard = []
    const names = ['TypeMaster', 'SpeedDemon', 'KeyboardNinja', 'TypingLegend', 'QuickFingers', 'WordWizard', 'FastTyper', 'AccuracyKing']
    
    for (let i = 0; i < 50; i++) {
      mockLeaderboard.push({
        rank: i + 1,
        username: `${names[Math.floor(Math.random() * names.length)]}${Math.floor(Math.random() * 9999)}`,
        wpm: Math.floor(Math.random() * 60) + 40, // 40-100 WPM
        accuracy: Math.floor(Math.random() * 15) + 85, // 85-100% accuracy
        testsCompleted: Math.floor(Math.random() * 500) + 10,
        avgWpm: Math.floor(Math.random() * 50) + 35,
        isCurrentUser: false
      })
    }
    
    // Sort by WPM descending
    return mockLeaderboard.sort((a, b) => b.wpm - a.wpm)
  }
}

// Async thunks
export const saveTestResult = createAsyncThunk(
  'userStats/saveTestResult',
  async (testResult, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState()
      const resultWithUser = {
        ...testResult,
        userId: auth.user?.id,
        username: auth.user?.username
      }
      return await mockAPI.saveTestResult(resultWithUser)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchUserStats = createAsyncThunk(
  'userStats/fetchUserStats',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState()
      if (!auth.user) {
        return rejectWithValue('User not authenticated')
      }
      return await mockAPI.getUserStats(auth.user.id)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchLeaderboard = createAsyncThunk(
  'userStats/fetchLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      return await mockAPI.getLeaderboard()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  // Current test state
  currentTest: {
    wpm: 0,
    accuracy: 0,
    timeSeconds: 0,
    wordsTyped: 0,
    errorsCount: 0,
    isActive: false,
    isCompleted: false,
    startTime: null,
  },
  
  // User statistics
  userStats: {
    testsCompleted: 0,
    avgWpm: 0,
    bestWpm: 0,
    avgAccuracy: 0,
    bestAccuracy: 0,
    totalTimeTyping: 0,
    recentResults: [],
    rank: null,
    percentile: 0
  },
  
  // Leaderboard
  leaderboard: [],
  
  // Loading states
  isLoadingStats: false,
  isLoadingLeaderboard: false,
  isSavingResult: false,
  
  // Error states
  error: null,
}

const userStatsSlice = createSlice({
  name: 'userStats',
  initialState,
  reducers: {
    // Current test management
    startTest: (state) => {
      state.currentTest.isActive = true
      state.currentTest.isCompleted = false
      state.currentTest.startTime = Date.now()
      state.currentTest.wpm = 0
      state.currentTest.accuracy = 0
      state.currentTest.timeSeconds = 0
      state.currentTest.wordsTyped = 0
      state.currentTest.errorsCount = 0
    },
    
    updateCurrentTest: (state, action) => {
      const { wpm, accuracy, timeSeconds, wordsTyped, errorsCount } = action.payload
      state.currentTest.wpm = wpm || 0
      state.currentTest.accuracy = accuracy || 0
      state.currentTest.timeSeconds = timeSeconds || 0
      state.currentTest.wordsTyped = wordsTyped || 0
      state.currentTest.errorsCount = errorsCount || 0
    },
    
    completeTest: (state) => {
      state.currentTest.isActive = false
      state.currentTest.isCompleted = true
    },
    
    resetTest: (state) => {
      state.currentTest = {
        wpm: 0,
        accuracy: 0,
        timeSeconds: 0,
        wordsTyped: 0,
        errorsCount: 0,
        isActive: false,
        isCompleted: false,
        startTime: null,
      }
    },
    
    clearError: (state) => {
      state.error = null
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Save test result
      .addCase(saveTestResult.pending, (state) => {
        state.isSavingResult = true
        state.error = null
      })
      .addCase(saveTestResult.fulfilled, (state, action) => {
        state.isSavingResult = false
        // Add the new result to recent results
        state.userStats.recentResults = [action.payload, ...state.userStats.recentResults].slice(0, 10)
        state.userStats.testsCompleted += 1
      })
      .addCase(saveTestResult.rejected, (state, action) => {
        state.isSavingResult = false
        state.error = action.payload
      })
      
      // Fetch user stats
      .addCase(fetchUserStats.pending, (state) => {
        state.isLoadingStats = true
        state.error = null
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.isLoadingStats = false
        state.userStats = action.payload
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.isLoadingStats = false
        state.error = action.payload
      })
      
      // Fetch leaderboard
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoadingLeaderboard = true
        state.error = null
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoadingLeaderboard = false
        state.leaderboard = action.payload
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoadingLeaderboard = false
        state.error = action.payload
      })
  }
})

export const {
  startTest,
  updateCurrentTest,
  completeTest,
  resetTest,
  clearError
} = userStatsSlice.actions

export default userStatsSlice.reducer
