
const STORAGE_KEYS = {
  USER_STATS: 'junkytype_user_stats',
  TEST_HISTORY: 'junkytype_test_history',
  USER_SETTINGS: 'junkytype_user_settings'
}

// User Statistics Management
export const getUserStats = () => {
  try {
    const stats = localStorage.getItem(STORAGE_KEYS.USER_STATS)
    return stats ? JSON.parse(stats) : {
      totalTests: 0,
      averageWPM: 0,
      bestWPM: 0,
      averageAccuracy: 0,
      bestAccuracy: 0,
      totalTimeTyping: 0,
      totalCharactersTyped: 0,
      totalWordsTyped: 0,
      totalErrors: 0,
      createdAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error loading user stats:', error)
    return null
  }
}

export const saveUserStats = (stats) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats))
    return true
  } catch (error) {
    console.error('Error saving user stats:', error)
    return false
  }
}

// Test History Management
export const getTestHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.TEST_HISTORY)
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error('Error loading test history:', error)
    return []
  }
}

export const saveTestResult = (testResult) => {
  try {
    const history = getTestHistory()
    const newTest = {
      ...testResult,
      id: Date.now(),
      timestamp: new Date().toISOString()
    }
    
    // Keep only last 100 tests to prevent localStorage bloat
    const updatedHistory = [newTest, ...history].slice(0, 100)
    localStorage.setItem(STORAGE_KEYS.TEST_HISTORY, JSON.stringify(updatedHistory))
    
    // Update user stats
    updateUserStats(newTest)
    return true
  } catch (error) {
    console.error('Error saving test result:', error)
    return false
  }
}

// Update aggregate user statistics
const updateUserStats = (testResult) => {
  const currentStats = getUserStats()
  if (!currentStats) return
  
  const updatedStats = {
    ...currentStats,
    totalTests: currentStats.totalTests + 1,
    averageWPM: Math.round(((currentStats.averageWPM * currentStats.totalTests) + testResult.wpm) / (currentStats.totalTests + 1)),
    bestWPM: Math.max(currentStats.bestWPM, testResult.wpm),
    averageAccuracy: Math.round(((currentStats.averageAccuracy * currentStats.totalTests) + testResult.accuracy) / (currentStats.totalTests + 1)),
    bestAccuracy: Math.max(currentStats.bestAccuracy, testResult.accuracy),
    totalTimeTyping: currentStats.totalTimeTyping + (testResult.time || 0),
    totalCharactersTyped: currentStats.totalCharactersTyped + (testResult.charactersTyped || 0),
    totalWordsTyped: currentStats.totalWordsTyped + (testResult.wordsTyped || Math.floor((testResult.charactersTyped || 0) / 5)),
    totalErrors: currentStats.totalErrors + (testResult.errors || 0)
  }
  
  saveUserStats(updatedStats)
}

// Settings Management
export const getUserSettings = () => {
  try {
    const settings = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS)
    return settings ? JSON.parse(settings) : {
      theme: 'dark',
      fontSize: 'medium',
      fontFamily: 'mono',
      soundEnabled: false,
      showLiveWPM: true,
      showLiveAccuracy: true,
      difficulty: 'normal',
      includeNumbers: false,
      includePunctuation: false
    }
  } catch (error) {
    console.error('Error loading user settings:', error)
    return null
  }
}

export const saveUserSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings))
    return true
  } catch (error) {
    console.error('Error saving user settings:', error)
    return false
  }
}

// Clear all data
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    return true
  } catch (error) {
    console.error('Error clearing data:', error)
    return false
  }
}

// Export data for backup
export const exportUserData = () => {
  try {
    return {
      stats: getUserStats(),
      history: getTestHistory(),
      settings: getUserSettings(),
      exportDate: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error exporting data:', error)
    return null
  }
}

// Import data from backup
export const importUserData = (data) => {
  try {
    if (data.stats) saveUserStats(data.stats)
    if (data.history) localStorage.setItem(STORAGE_KEYS.TEST_HISTORY, JSON.stringify(data.history))
    if (data.settings) saveUserSettings(data.settings)
    return true
  } catch (error) {
    console.error('Error importing data:', error)
    return false
  }
}
