"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { RotateCcw, Zap, Target, AlertCircle, Clock, Hash } from "lucide-react"
import { saveTestResult, updateCurrentTest, startTest, completeTest, resetTest } from '../store/slices/userStatsSlice'
import { calculateTypingStats, calculateLiveStats, getPerformanceLevel } from '../utils/typingUtils'

// Enhanced character component with stable layout to prevent bouncing
const Char = React.memo(({ char, isCorrect, isIncorrect, isCurrent, settings, blindMode, isTyped }) => {
  const getFontClass = () => {
    switch (settings.fontFamily) {
      case 'serif': return 'font-serif'
      case 'sans': return 'font-sans'
      default: return 'font-mono'
    }
  }

  const getColorClass = () => {
    if (blindMode && isTyped && !isCurrent) return 'text-transparent'
    
    if (isCorrect) {
      return settings.colorTheme === 'neon' ? 'text-green-300' : 'text-green-400'
    }
    
    if (isIncorrect && settings.highlightErrors) {
      return settings.colorTheme === 'neon' ? 'text-red-300' : 'text-red-400'
    }
    
    if (isCurrent) {
      return settings.theme === 'dark' ? 'text-white' : 'text-gray-900'
    }
    
    return settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  }

  const getCursorStyle = () => {
    if (!isCurrent) return {}
    
    switch (settings.cursorStyle) {
      case 'line':
        return { borderLeft: '2px solid #60a5fa' }
      case 'underline':
        return { borderBottom: '2px solid #60a5fa' }
      default:
        return { backgroundColor: 'rgba(96, 165, 250, 0.3)' }
    }
  }

  return (
    <span 
      className={`${getFontClass()} ${getColorClass()} typing-char ${isCurrent ? 'cursor-stable' : ''}`}
      style={{ 
        fontSize: `${settings.fontSize}px`,
        minWidth: char === ' ' ? '0.6ch' : '1ch',
        ...getCursorStyle()
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  )
})

function TypeareaOptimized() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const settings = useSelector(state => state.settings)
  const { theme, language, wordCount, timeLimit, fontSize, fontFamily, cursorStyle, 
          smoothCaret, showLiveWPM, showLiveAccuracy, blindMode, highlightErrors,
          includeNumbers, includePunctuation, difficulty } = settings
  const isAuthModalOpen = useSelector(state => state.auth.isAuthModalOpen)
  const { isAuthenticated } = useSelector(state => state.auth)
  
  // Core state
  const [words, setWords] = useState([])
  const [input, setInput] = useState("")
  const [isStarted, setIsStarted] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100, errors: 0 })
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [wordsCompleted, setWordsCompleted] = useState(0)
  
  // Refs for performance
  const startTime = useRef(null)
  const allWords = useRef([])
  const targetText = useRef("")
  const lastStatsUpdate = useRef(0)
  
  // MonkeyType-style WPM calculation (characters per minute / 5)
  const calculateWPM = useCallback((chars, timeMs) => {
    if (!timeMs || chars === 0) return 0
    const minutes = timeMs / 60000
    return Math.round(chars / 5 / minutes)
  }, [])
  
  // Optimized stats calculation using typingUtils
  const updateStatsSync = useCallback((currentInput) => {
    if (!isStarted || !startTime.current) return
    
    const now = Date.now()

    if (now - lastStatsUpdate.current < 100) return
    lastStatsUpdate.current = now
    
    if (currentInput.length === 0) {
      setStats({ wpm: 0, accuracy: 100, errors: 0 })
      return
    }
    
 
    const liveStats = calculateLiveStats(currentInput, targetText.current, startTime.current)
    setStats(liveStats)
  }, [isStarted])
  
  // Handle typing
  const handleKeyDown = useCallback((e) => {
    if (isComplete || isAuthModalOpen) return
    
    // Start typing
    if (!isStarted && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      setIsStarted(true)
      startTime.current = Date.now()
    }
    
    if (e.key === "Escape") {
      resetTest()
      return
    }
    
    if (e.key === "Backspace") {
      const newInput = input.slice(0, -1)
      setInput(newInput)
      // Update stats immediately for backspace
      if (isStarted) {
        requestAnimationFrame(() => updateStatsSync(newInput))
      }
      e.preventDefault()
      return
    }
    
    // Only allow printable characters
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      const newInput = input + e.key
      
      // For time tests, generate more words when user is 80% through
      if (timeLimit && newInput.length >= targetText.current.length * 0.8) {
        const wordsToUse = allWords.current.length > 0 ? allWords.current : [
          "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "and", "cat",
          "hello", "world", "typing", "test", "speed", "fast", "slow", "good", "great", "awesome",
          "javascript", "react", "code", "programming", "computer", "keyboard", "mouse", "screen"
        ]
        
        // Add another 100 words to the existing text
        const additionalWords = []
        for (let i = 0; i < 100; i++) {
          const randomIndex = Math.floor(Math.random() * wordsToUse.length)
          additionalWords.push(wordsToUse[randomIndex])
        }
        
        const newText = targetText.current + " " + additionalWords.join(" ")
        targetText.current = newText
        setWords(prev => [...prev, ...additionalWords])
      }
      
      // Check if test is complete
      if (newInput.length >= targetText.current.length) {
        // For word tests, complete normally
        if (!timeLimit) {
          setInput(targetText.current) // Ensure exact length
          completeTest(targetText.current)
        }
        return
      }
      
      setInput(newInput)
      
      // Update stats immediately when typing
      if (isStarted) {
        requestAnimationFrame(() => updateStatsSync(newInput))
      }
      
      e.preventDefault()
    }
  }, [input, isStarted, isComplete])
  
  // Complete test
  const completeTest = useCallback((finalInput) => {
    if (!startTime.current) return
    
    const elapsed = Date.now() - startTime.current
    
    // Add test completion info to stats
    setStats(prevStats => ({
      ...prevStats,
      testType: timeLimit ? 'time' : 'words',
      time: Math.round(elapsed / 1000)
    }))
    
    setIsComplete(true)
    
    // Save result if authenticated
    if (isAuthenticated) {
      dispatch(saveTestResult({
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        errors: stats.errors,
        time: Math.round(elapsed / 1000),
        testType: timeLimit ? 'time' : 'words'
      }))
    }
  }, [timeLimit, isAuthenticated, dispatch, stats])
  
  // Timer effect for time-based tests
  useEffect(() => {
    let interval = null
    
    if (isStarted && timeLimit && !isComplete) {
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime.current
        const remaining = timeLimit - Math.floor(elapsed / 1000)
        
        if (remaining <= 0) {
          completeTestByTime()
        } else {
          setTimeRemaining(remaining)
        }
      }, 100)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isStarted, timeLimit, isComplete])
  
  // Complete test by time limit
  const completeTestByTime = useCallback(() => {
    if (!startTime.current) return
    
    // Add test completion info to stats
    setStats(prevStats => ({
      ...prevStats,
      testType: 'time',
      time: timeLimit
    }))
    
    setIsComplete(true)
    
    // Save result if authenticated
    if (isAuthenticated) {
      dispatch(saveTestResult({
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        errors: stats.errors,
        time: timeLimit,
        testType: 'time'
      }))
    }
  }, [timeLimit, isAuthenticated, dispatch, stats])
  
  // Reset test
  const resetTest = useCallback(() => {
    // Clear all states first
    setInput("")
    setIsStarted(false)
    setIsComplete(false)
    setStats({ wpm: 0, accuracy: 100, errors: 0 })
    setTimeRemaining(timeLimit)
    setWordsCompleted(0)
    startTime.current = null
    
    // Use fallback words if main words array isn't ready
    const wordsToUse = allWords.current.length > 0 ? allWords.current : [
      "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "and", "cat",
      "hello", "world", "typing", "test", "speed", "fast", "slow", "good", "great", "awesome",
      "javascript", "react", "code", "programming", "computer", "keyboard", "mouse", "screen", "window", "door",
      "house", "car", "bike", "walk", "run", "jump", "fly", "swim", "dance", "sing",
      "book", "read", "write", "learn", "study", "work", "play", "game", "fun", "happy"
    ]
    
    // Generate words based on current settings
    const newWords = []
    const targetWordCount = timeLimit ? 100 : (wordCount || 50) // 100 for time tests, exact count for word tests
    
    // Apply difficulty filter
    let availableWords = [...wordsToUse]
    
    if (difficulty === 'easy') {
      availableWords = availableWords.filter(word => word.length <= 5)
    } else if (difficulty === 'hard') {
      availableWords = availableWords.filter(word => word.length >= 6)
    }
    
    for (let i = 0; i < targetWordCount; i++) {
      const randomIndex = Math.floor(Math.random() * availableWords.length)
      let word = availableWords[randomIndex]
      
      // Add numbers if enabled
      if (includeNumbers && Math.random() < 0.1) {
        word += Math.floor(Math.random() * 100)
      }
      
      // Add punctuation if enabled
      if (includePunctuation && Math.random() < 0.15) {
        const punctuation = ['.', ',', '!', '?', ';', ':']
        word += punctuation[Math.floor(Math.random() * punctuation.length)]
      }
      
      newWords.push(word)
    }
    
    const newText = newWords.join(" ")
    targetText.current = newText
    setWords(newWords)
  }, [timeLimit, wordCount, difficulty, includeNumbers, includePunctuation])
  
  // Load words
  useEffect(() => {
    // Always start with fallback words for immediate display
    const fallbackWords = [
      "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "and", "cat",
      "hello", "world", "typing", "test", "speed", "fast", "slow", "good", "great", "awesome",
      "javascript", "react", "code", "programming", "computer", "keyboard", "mouse", "screen", "window", "door",
      "house", "car", "bike", "walk", "run", "jump", "fly", "swim", "dance", "sing",
      "book", "read", "write", "learn", "study", "work", "play", "game", "fun", "happy"
    ]
    
    allWords.current = fallbackWords
    
    // Generate initial test immediately
    const newWords = []
    for (let i = 0; i < 50; i++) {
      const randomIndex = Math.floor(Math.random() * fallbackWords.length)
      newWords.push(fallbackWords[randomIndex])
    }
    
    const newText = newWords.join(" ")
    targetText.current = newText
    setWords(newWords)
    setInput("")
    setIsStarted(false)
    setIsComplete(false)
    setStats({ wpm: 0, accuracy: 100, errors: 0 })
    startTime.current = null
    
    // Set loading to false immediately - we have words ready
    setIsLoading(false)
    
    // Try to load from API in background (don't await this)
    fetch(`https://api.allorigins.win/raw?url=https://monkeytype.com/languages/${language}.json`)
      .then(response => response.json())
      .then(data => {
        if (data.words && data.words.length > 0) {
          allWords.current = data.words
          console.log("Loaded", data.words.length, "words from API")
        }
      })
      .catch(apiError => {
        console.log("API failed, using fallback words:", apiError)
      })
  }, [language])
  // Keyboard event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
  
  // Memoized character rendering for performance
  const renderedChars = useMemo(() => {
    const target = targetText.current
  
    if (!target) {
      return <div className="text-red-500">No text loaded</div>
    }
    
    return target.split("").map((char, i) => {
      const isTyped = i < input.length
      const isCorrect = isTyped && input[i] === char
      const isIncorrect = isTyped && input[i] !== char
      const isCurrent = i === input.length
      
      return (
        <Char
          key={i}
          char={char}
          isCorrect={isCorrect}
          isIncorrect={isIncorrect}
          isCurrent={isCurrent}
          settings={settings}
          blindMode={blindMode}
          isTyped={isTyped}
        />
      )
    })
  }, [input, words, settings, blindMode])
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading words...</div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-900 overflow-y-auto">
      {/* Test Selection - Always show when test not active */}
      {!isStarted && !isComplete && (
        <div className="mb-8 w-full max-w-4xl">
          <div className="flex flex-col gap-6 items-center">
            {/* Time Limits */}
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <span className="text-gray-400 text-sm font-medium mr-2">⏱️ Time:</span>
              {[15, 30, 60, 120, 300].map(time => (
                <button
                  key={time}
                  onClick={() => {
                    // Immediate state updates
                    dispatch({ type: 'settings/setWordCount', payload: null })
                    dispatch({ type: 'settings/setTimeLimit', payload: time })
                    
                    // Force immediate reset
                    setInput("")
                    setIsStarted(false)
                    setIsComplete(false)
                    setStats({ wpm: 0, accuracy: 100, errors: 0 })
                    setTimeRemaining(time)
                    startTime.current = null
                    
                    // Generate 100 words for time tests
                    const wordsToUse = allWords.current.length > 0 ? allWords.current : [
                      "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "and", "cat",
                      "hello", "world", "typing", "test", "speed", "fast", "slow", "good", "great", "awesome",
                      "javascript", "react", "code", "programming", "computer", "keyboard", "mouse", "screen"
                    ]
                    
                    const newWords = []
                    for (let i = 0; i < 100; i++) {
                      const randomIndex = Math.floor(Math.random() * wordsToUse.length)
                      newWords.push(wordsToUse[randomIndex])
                    }
                    
                    const newText = newWords.join(" ")
                    targetText.current = newText
                    setWords(newWords)
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    timeLimit === time
                      ? 'bg-yellow-500 text-black shadow-lg scale-105'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                  }`}
                >
                  {time}s
                </button>
              ))}
            </div>
            
            {/* Word Counts */}
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <span className="text-gray-400 text-sm font-medium mr-2">📝 Words:</span>
              {[10, 25, 50, 100, 200].map(count => (
                <button
                  key={count}
                  onClick={() => {
                    // Immediate state updates
                    dispatch({ type: 'settings/setTimeLimit', payload: null })
                    dispatch({ type: 'settings/setWordCount', payload: count })
                    
                    // Force immediate reset
                    setInput("")
                    setIsStarted(false)
                    setIsComplete(false)
                    setStats({ wpm: 0, accuracy: 100, errors: 0 })
                    setTimeRemaining(null)
                    startTime.current = null
                    
                    // Generate exact word count for word tests
                    const wordsToUse = allWords.current.length > 0 ? allWords.current : [
                      "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "and", "cat",
                      "hello", "world", "typing", "test", "speed", "fast", "slow", "good", "great", "awesome",
                      "javascript", "react", "code", "programming", "computer", "keyboard", "mouse", "screen"
                    ]
                    
                    const newWords = []
                    for (let i = 0; i < count; i++) {
                      const randomIndex = Math.floor(Math.random() * wordsToUse.length)
                      newWords.push(wordsToUse[randomIndex])
                    }
                    
                    const newText = newWords.join(" ")
                    targetText.current = newText
                    setWords(newWords)
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    !timeLimit && wordCount === count
                      ? 'bg-purple-500 text-black shadow-lg scale-105'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Test Info Bar */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 bg-gray-800/95 border border-gray-700 rounded-full px-6 py-3 backdrop-blur-md shadow-xl">
          {timeLimit && (
            <div className="flex items-center gap-2 text-yellow-400">
              <Clock className="w-4 h-4" />
              <span className="text-lg font-bold">
                {isStarted ? (timeRemaining || 0) : timeLimit}
              </span>
              <span className="text-sm">SEC</span>
            </div>
          )}
          {!timeLimit && (
            <div className="flex items-center gap-2 text-purple-400">
              <Hash className="w-4 h-4" />
              <span className="text-lg font-bold">{wordCount}</span>
              <span className="text-sm">WORDS</span>
            </div>
          )}
          {isStarted && showLiveWPM && (
            <div className="flex items-center gap-2 text-blue-400">
              <Zap className="w-4 h-4" />
              <span className="text-lg font-bold">{stats.wpm}</span>
              <span className="text-sm">WPM</span>
            </div>
          )}
          {isStarted && showLiveAccuracy && (
            <div className="flex items-center gap-2 text-green-400">
              <Target className="w-4 h-4" />
              <span className="text-lg font-bold">{stats.accuracy}%</span>
              <span className="text-sm">ACC</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Result modal */}
      {isComplete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-800 border border-gray-600 rounded-2xl p-8 max-w-5xl w-full mx-4 shadow-2xl my-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-2 text-white">Test Complete!</h2>
              <p className="text-gray-400">Great job! Here's how you performed:</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-center transform hover:scale-105 transition-transform">
                <div className="text-3xl font-bold text-white mb-1">{stats.wpm}</div>
                <div className="text-blue-200 text-sm font-medium">Words Per Minute</div>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-center transform hover:scale-105 transition-transform">
                <div className="text-3xl font-bold text-white mb-1">{stats.accuracy}%</div>
                <div className="text-green-200 text-sm font-medium">Accuracy</div>
              </div>
              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 text-center transform hover:scale-105 transition-transform">
                <div className="text-3xl font-bold text-white mb-1">{stats.errors}</div>
                <div className="text-red-200 text-sm font-medium">Errors</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-center transform hover:scale-105 transition-transform">
                <div className="text-3xl font-bold text-white mb-1">{stats.time || 0}s</div>
                <div className="text-purple-200 text-sm font-medium">Time Taken</div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="bg-gray-700/50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">📊 Detailed Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Test Duration:</span>
                  <span className="text-white ml-2 font-medium">{stats.time || 0}s</span>
                </div>
                <div>
                  <span className="text-gray-400">Characters Typed:</span>
                  <span className="text-green-400 ml-2 font-medium">{Math.round((stats.wpm * 5 * (stats.time || 0)) / 60)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Test Type:</span>
                  <span className="text-blue-400 ml-2 font-medium capitalize">{stats.testType || 'words'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Words Typed:</span>
                  <span className="text-purple-400 ml-2 font-medium">{Math.round((stats.wpm * (stats.time || 0)) / 60)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Total Errors:</span>
                  <span className="text-red-400 ml-2 font-medium">{stats.errors}</span>
                </div>
                <div>
                  <span className="text-gray-400">Net WPM:</span>
                  <span className="text-cyan-400 ml-2 font-medium">{stats.wpm}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={resetTest}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => navigate('/ai-analysis', { state: { testResult: stats } })}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
              >
                🤖 Get AI Analysis
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main typing area */}
      <div className="w-full max-w-6xl">
        <div className="bg-gray-800/50 rounded-2xl p-6 md:p-8 border border-gray-700/50 backdrop-blur-sm shadow-xl">
          {/* Text display with stable layout to prevent bouncing */}
          <div className="w-full min-h-[200px] md:min-h-[250px] p-4 md:p-6 flex items-start justify-center overflow-hidden typing-optimized">
            <div 
              className="text-xl md:text-2xl font-mono leading-relaxed max-w-full typing-text"
              style={{ 
                lineHeight: '3rem', 
                wordSpacing: '0.5rem',
                letterSpacing: '0.05rem',
                minHeight: '200px',
                width: '100%',
                display: 'block',
                whiteSpace: 'pre-wrap',
                wordBreak: 'keep-all',
                overflowWrap: 'break-word',
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              {renderedChars}
            </div>
          </div>
          
          {/* Hint */}
          {!isStarted && (
            <div className="text-center mt-6 text-gray-500">
              <p className="text-lg mb-2">✨ Start typing to begin the test</p>
              <p className="text-sm">Focus on accuracy first, speed will come naturally!</p>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <button
            onClick={resetTest}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-all duration-200 font-medium transform hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
            New Test
          </button>
          <div className="text-sm text-gray-500 text-center">
            Press <kbd className="px-2 py-1 bg-gray-700 rounded text-xs mx-1">ESC</kbd> to restart
            <span className="hidden sm:inline"> • </span>
            <br className="sm:hidden" />
            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs mx-1">Tab</kbd> + <kbd className="px-2 py-1 bg-gray-700 rounded text-xs mx-1">Enter</kbd> for new test
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypeareaOptimized
