import { createSlice } from "@reduxjs/toolkit"
import { getUserSettings, saveUserSettings } from '../../utils/localStorage'

// Load initial state from localStorage
const loadInitialState = () => {
  const savedSettings = getUserSettings()
  return savedSettings ? {
    ...savedSettings,
    // Ensure all required fields exist
    language: savedSettings.language || "english",
    wordCount: savedSettings.wordCount || 50,
    timeLimit: savedSettings.timeLimit || null,
    timeLimits: [15, 30, 60, 120, 300],
    wordCounts: [10, 25, 50, 100, 200],
    includeSymbols: savedSettings.includeSymbols || false,
    customWords: savedSettings.customWords || "",
    smoothCaret: savedSettings.smoothCaret !== undefined ? savedSettings.smoothCaret : true,
    soundEffects: savedSettings.soundEffects || false,
    fontSize: savedSettings.fontSize || 24,
    cursorStyle: savedSettings.cursorStyle || "block",
    blindMode: savedSettings.blindMode || false,
    highlightErrors: savedSettings.highlightErrors !== undefined ? savedSettings.highlightErrors : true,
    showKeyboard: savedSettings.showKeyboard || false,
    colorTheme: savedSettings.colorTheme || "default"
  } : {
    language: "english",
    theme: "dark",
    wordCount: 50,
    timeLimit: null,
    timeLimits: [15, 30, 60, 120, 300],
    wordCounts: [10, 25, 50, 100, 200],
    includeNumbers: false,
    includePunctuation: false,
    includeSymbols: false,
    difficulty: "normal",
    customWords: "",
    smoothCaret: true,
    soundEffects: false,
    fontSize: 24,
    fontFamily: "mono",
    cursorStyle: "block",
    showLiveWPM: true,
    showLiveAccuracy: true,
    blindMode: false,
    highlightErrors: true,
    showKeyboard: false,
    colorTheme: "default"
  }
}

const settingsSlice = createSlice({
  name: "settings",
  initialState: loadInitialState(),
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload
      saveUserSettings(state)
    },
    setTheme: (state, action) => {
      state.theme = action.payload
      saveUserSettings(state)
    },
    setWordCount: (state, action) => {
      state.wordCount = action.payload
      saveUserSettings(state)
    },
    setTimeLimit: (state, action) => {
      state.timeLimit = action.payload
      saveUserSettings(state)
    },
    setIncludeNumbers: (state, action) => {
      state.includeNumbers = action.payload
      saveUserSettings(state)
    },
    setIncludePunctuation: (state, action) => {
      state.includePunctuation = action.payload
      saveUserSettings(state)
    },
    setIncludeSymbols: (state, action) => {
      state.includeSymbols = action.payload
      saveUserSettings(state)
    },
    setDifficulty: (state, action) => {
      state.difficulty = action.payload
      saveUserSettings(state)
    },
    setCustomWords: (state, action) => {
      state.customWords = action.payload
      saveUserSettings(state)
    },
    setSmoothCaret: (state, action) => {
      state.smoothCaret = action.payload
      saveUserSettings(state)
    },
    setSoundEffects: (state, action) => {
      state.soundEffects = action.payload
      saveUserSettings(state)
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload
      saveUserSettings(state)
    },
    setFontFamily: (state, action) => {
      state.fontFamily = action.payload
      saveUserSettings(state)
    },
    setCursorStyle: (state, action) => {
      state.cursorStyle = action.payload
      saveUserSettings(state)
    },
    setShowLiveWPM: (state, action) => {
      state.showLiveWPM = action.payload
      saveUserSettings(state)
    },
    setShowLiveAccuracy: (state, action) => {
      state.showLiveAccuracy = action.payload
      saveUserSettings(state)
    },
    setBlindMode: (state, action) => {
      state.blindMode = action.payload
      saveUserSettings(state)
    },
    setHighlightErrors: (state, action) => {
      state.highlightErrors = action.payload
      saveUserSettings(state)
    },
    setShowKeyboard: (state, action) => {
      state.showKeyboard = action.payload
      saveUserSettings(state)
    },
    setColorTheme: (state, action) => {
      state.colorTheme = action.payload
      saveUserSettings(state)
    },
    loadSettings: (state) => {
      const savedSettings = getUserSettings()
      if (savedSettings) {
        Object.assign(state, savedSettings)
      }
    }
  },
})

export const { 
  setLanguage, 
  setTheme, 
  setWordCount,
  setTimeLimit,
  setIncludeNumbers,
  setIncludePunctuation,
  setIncludeSymbols,
  setDifficulty,
  setCustomWords,
  setSmoothCaret,
  setSoundEffects,
  setFontSize,
  setFontFamily,
  setCursorStyle,
  setShowLiveWPM,
  setShowLiveAccuracy,
  setBlindMode,
  setHighlightErrors,
  setShowKeyboard,
  setColorTheme,
  loadSettings
} = settingsSlice.actions
export default settingsSlice.reducer