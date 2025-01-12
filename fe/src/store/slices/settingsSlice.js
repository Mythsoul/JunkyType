import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  language: "english",
  theme: "dark",
  wordCount: 50,
  
  // Time-based options
  timeLimit: null, // null means no limit, otherwise seconds
  timeLimits: [15, 30, 60, 120, 300], // preset time limits
  
  // Word-based options
  wordCounts: [10, 25, 50, 100, 200],
  
  // Content options
  includeNumbers: false,
  includePunctuation: false,
  includeSymbols: false,
  difficulty: "normal", // easy, normal, hard
  customWords: "", // custom word list
  
  // Typing experience
  smoothCaret: true,
  soundEffects: false,
  fontSize: 24, // in pixels
  fontFamily: "mono", // mono, serif, sans
  cursorStyle: "block", // block, line, underline
  showLiveWPM: true,
  showLiveAccuracy: true,
  blindMode: false, // hide text after typing
  
  // Visual options
  highlightErrors: true,
  showKeyboard: false,
  colorTheme: "default", // default, neon, forest, ocean
}

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setWordCount: (state, action) => {
      state.wordCount = action.payload
    },
    setTimeLimit: (state, action) => {
      state.timeLimit = action.payload
    },
    setIncludeNumbers: (state, action) => {
      state.includeNumbers = action.payload
    },
    setIncludePunctuation: (state, action) => {
      state.includePunctuation = action.payload
    },
    setIncludeSymbols: (state, action) => {
      state.includeSymbols = action.payload
    },
    setDifficulty: (state, action) => {
      state.difficulty = action.payload
    },
    setCustomWords: (state, action) => {
      state.customWords = action.payload
    },
    setSmoothCaret: (state, action) => {
      state.smoothCaret = action.payload
    },
    setSoundEffects: (state, action) => {
      state.soundEffects = action.payload
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload
    },
    setFontFamily: (state, action) => {
      state.fontFamily = action.payload
    },
    setCursorStyle: (state, action) => {
      state.cursorStyle = action.payload
    },
    setShowLiveWPM: (state, action) => {
      state.showLiveWPM = action.payload
    },
    setShowLiveAccuracy: (state, action) => {
      state.showLiveAccuracy = action.payload
    },
    setBlindMode: (state, action) => {
      state.blindMode = action.payload
    },
    setHighlightErrors: (state, action) => {
      state.highlightErrors = action.payload
    },
    setShowKeyboard: (state, action) => {
      state.showKeyboard = action.payload
    },
    setColorTheme: (state, action) => {
      state.colorTheme = action.payload
    },
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
  setColorTheme
} = settingsSlice.actions
export default settingsSlice.reducer