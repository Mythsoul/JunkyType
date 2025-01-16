"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RotateCcw, Zap, Target, AlertCircle, Clock, Hash } from "lucide-react"
import { saveTestResult, updateCurrentTest, startTest, completeTest, resetTest } from '../store/slices/userStatsSlice'

// Enhanced character component with settings integration
const Char = React.memo(({ char, isCorrect, isIncorrect, isCurrent, settings, blindMode, isTyped }) => {
  const getFontClass = () => {
    switch (settings.fontFamily) {
      case 'serif': return 'font-serif'
      case 'sans': return 'font-sans'
      default: return 'font-mono'
    }
  }

  const getCursorClass = () => {
    if (!isCurrent) return ''
    
    const baseClass = settings.smoothCaret ? 'transition-all duration-200' : ''
    
    switch (settings.cursorStyle) {
      case 'line':
        return `${baseClass} border-l-2 border-blue-400 pl-1`
      case 'underline':
        return `${baseClass} border-b-2 border-blue-400`
      default:
        return `${baseClass} bg-blue-400/30 px-1 rounded`
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

  return (
    <span 
      className={`${getFontClass()} ${getCursorClass()} ${getColorClass()}`}
      style={{ fontSize: `${settings.fontSize}px` }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  )
})

function TypeareaOptimized() {
  const dispatch = useDispatch()
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
  const [result, setResult] = useState(null)
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
  
  // Optimized stats calculation for direct use (no debouncing in effect)
  const updateStatsSync = useCallback((currentInput) => {
    if (!isStarted || !startTime.current) return
    
    const now = Date.now()
    // Only update stats every 100ms for performance
    if (now - lastStatsUpdate.current < 100) return
    lastStatsUpdate.current = now
    
    const elapsed = now - startTime.current
    const inputLength = currentInput.length
    
    if (inputLength === 0) {
      setStats({ wpm: 0, accuracy: 100, errors: 0 })
      return
    }
    
    // Calculate accuracy and errors
    let correct = 0
    let errors = 0
    const target = targetText.current
    
    for (let i = 0; i < inputLength; i++) {
      if (i < target.length && currentInput[i] === target[i]) {
        correct++
      } else {
        errors++
      }
    }
    
    const accuracy = Math.round((correct / inputLength) * 100)
    const wpm = calculateWPM(correct, elapsed)
    
    setStats({ wpm, accuracy, errors })
  }, [isStarted, calculateWPM])
  
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
      
      // Check if test is complete
      if (newInput.length >= targetText.current.length) {
        setInput(targetText.current) // Ensure exact length
        completeTest(targetText.current)
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
    const target = targetText.current
    
    let correct = 0
    let errors = 0
    
    // Calculate based on what was actually typed
    const typedLength = Math.min(finalInput.length, target.length)
    
    for (let i = 0; i < typedLength; i++) {
      if (finalInput[i] === target[i]) {
        correct++
      } else {
        errors++
      }
    }
    
    // Add errors for missing characters
    if (target.length > finalInput.length) {
      errors += target.length - finalInput.length
    }
    
    const accuracy = typedLength > 0 ? Math.round((correct / typedLength) * 100) : 0
    const wpm = calculateWPM(correct, elapsed)
    
    const finalResult = {
      wpm: Math.max(0, wpm),
      accuracy: Math.max(0, Math.min(100, accuracy)),
      errors,
      time: Math.round(elapsed / 1000),
      charactersTyped: finalInput.length,
      totalCharacters: target.length,
      testType: timeLimit ? 'time' : 'words'
    }
    
    setResult(finalResult)
    setIsComplete(true)
    
    // Save result if authenticated
    if (isAuthenticated) {
      dispatch(saveTestResult(finalResult))
    }
    
    // Auto restart after 3 seconds
    setTimeout(() => {
      resetTest()
    }, 3000)
  }, [calculateWPM, timeLimit, isAuthenticated, dispatch])
  
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
    
    const elapsed = timeLimit * 1000 // Convert to ms
    const target = input // Use current input when time runs out
    const targetLength = targetText.current.length
    
    let correct = 0
    let errors = 0
    
    for (let i = 0; i < input.length; i++) {
      if (i < targetText.current.length && input[i] === targetText.current[i]) {
        correct++
      } else {
        errors++
      }
    }
    
    const accuracy = input.length > 0 ? Math.round((correct / input.length) * 100) : 0
    const wpm = calculateWPM(correct, elapsed)
    
    const finalResult = {
      wpm,
      accuracy,
      errors,
      time: timeLimit,
      charactersTyped: input.length,
      testType: 'time'
    }
    
    setResult(finalResult)
    setIsComplete(true)
    
    // Save result if authenticated
    if (isAuthenticated) {
      dispatch(saveTestResult(finalResult))
    }
    
    // Auto restart after 3 seconds
    setTimeout(() => {
      resetTest()
    }, 3000)
  }, [calculateWPM, timeLimit, input, isAuthenticated, dispatch])
  
  // Reset test
  const resetTest = useCallback(() => {
    // Use fallback words if main words array isn't ready
    const wordsToUse = allWords.current.length > 0 ? allWords.current : [
      "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "and", "cat",
      "hello", "world", "typing", "test", "speed", "fast", "slow", "good", "great", "awesome",
      "javascript", "react", "code", "programming", "computer", "keyboard", "mouse", "screen", "window", "door",
      "house", "car", "bike", "walk", "run", "jump", "fly", "swim", "dance", "sing",
      "book", "read", "write", "learn", "study", "work", "play", "game", "fun", "happy"
    ]
    
    // Generate words based on settings
    const newWords = []
    const targetWordCount = timeLimit ? 200 : (wordCount || 50) // More words for time tests
    
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
    setInput("")
    setIsStarted(false)
    setIsComplete(false)
    setResult(null)
    setStats({ wpm: 0, accuracy: 100, errors: 0 })
    setTimeRemaining(timeLimit)
    setWordsCompleted(0)
    startTime.current = null
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
    setResult(null)
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
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-900">
      {/* Test Selection - Always show when test not active */}
      {!isStarted && !isComplete && (
        <div className="mb-8">
          <div className="flex flex-col gap-4 items-center">
            {/* Time Limits */}
            <div className="flex gap-3">
              <span className="text-gray-400 text-sm font-medium mr-2">time:</span>
              {[15, 30, 60, 120, 300].map(time => (
                <button
                  key={time}
                  onClick={() => {
                    dispatch({ type: 'settings/setTimeLimit', payload: time })
                    setIsStarted(false)
                    setIsComplete(false)
                    setInput('')
                    setTimeout(() => resetTest(), 50)
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    timeLimit === time
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {time}s
                </button>
              ))}
            </div>
            
            {/* Word Counts */}
            <div className="flex gap-3">
              <span className="text-gray-400 text-sm font-medium mr-2">words:</span>
              {[10, 25, 50, 100, 200].map(count => (
                <button
                  key={count}
                  onClick={() => {
                    dispatch({ type: 'settings/setWordCount', payload: count })
                    dispatch({ type: 'settings/setTimeLimit', payload: null })
                    setIsStarted(false)
                    setIsComplete(false)
                    setInput('')
                    setTimeout(() => resetTest(), 50)
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    !timeLimit && wordCount === count
                      ? 'bg-purple-500 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
        <div className="flex items-center gap-4 bg-gray-800/90 border border-gray-700 rounded-full px-6 py-3 backdrop-blur">
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
      {isComplete && result && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-2xl w-full mx-4 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-6 text-white">Test Complete!</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-400">{result.wpm}</div>
                <div className="text-sm text-gray-400">WPM</div>
              </div>
              <div className="bg-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-400">{result.accuracy}%</div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
              <div className="bg-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-red-400">{result.errors}</div>
                <div className="text-sm text-gray-400">Errors</div>
              </div>
              <div className="bg-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-purple-400">{result.time}s</div>
                <div className="text-sm text-gray-400">Time</div>
              </div>
            </div>
            
            <div className="text-gray-400">Starting new test in 3 seconds...</div>
          </div>
        </div>
      )}
      
      {/* Main typing area */}
      <div className="w-full max-w-4xl">
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
          {/* Text display */}
          <div className="relative w-full h-48 overflow-hidden">
            <div className="absolute inset-0 p-6">
              <div className="text-2xl font-mono leading-8 select-none" style={{ lineHeight: '2rem', fontFamily: 'ui-monospace, monospace' }}>
                {renderedChars}
              </div>
            </div>
          </div>
          
          {/* Hint */}
          {!isStarted && (
            <div className="text-center mt-8 text-gray-500">
              Start typing to begin the test
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={resetTest}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            New Test
          </button>
          <div className="text-sm text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">ESC</kbd> to restart
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypeareaOptimized
