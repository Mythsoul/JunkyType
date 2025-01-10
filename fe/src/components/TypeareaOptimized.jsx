"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useSelector } from "react-redux"
import { RotateCcw, Zap, Target, AlertCircle } from "lucide-react"

// Ultra-lightweight character component
const Char = React.memo(({ char, isCorrect, isIncorrect, isCurrent }) => (
  <span 
    className={`font-mono text-2xl ${
      isCorrect ? "text-green-400" :
      isIncorrect ? "text-red-400" :
      isCurrent ? "text-white bg-blue-500/30 px-1 rounded" :
      "text-gray-400"
    }`}
  >
    {char === " " ? "\u00A0" : char}
  </span>
))

function TypeareaOptimized() {
  const theme = useSelector(state => state.settings.theme)
  const language = useSelector(state => state.settings.language)
  
  // Core state
  const [words, setWords] = useState([])
  const [input, setInput] = useState("")
  const [isStarted, setIsStarted] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100, errors: 0 })
  const [result, setResult] = useState(null)
  
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
    if (isComplete) return
    
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
    
    for (let i = 0; i < target.length; i++) {
      if (finalInput[i] === target[i]) {
        correct++
      } else {
        errors++
      }
    }
    
    const accuracy = Math.round((correct / target.length) * 100)
    const wpm = calculateWPM(correct, elapsed)
    
    setResult({
      wpm,
      accuracy,
      errors,
      time: Math.round(elapsed / 1000)
    })
    
    setIsComplete(true)
    
    // Auto restart after 3 seconds
    setTimeout(() => {
      resetTest()
    }, 3000)
  }, [calculateWPM])
  
  // Reset test
  const resetTest = useCallback(() => {
    if (!allWords.current.length) return
    
    // Generate new words
    const newWords = []
    for (let i = 0; i < 50; i++) {
      const randomIndex = Math.floor(Math.random() * allWords.current.length)
      newWords.push(allWords.current[randomIndex])
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
  }, [])
  
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
      console.log('No target text')
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
        />
      )
    })
  }, [input, words])
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading words...</div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-900">
      {/* Live stats */}
      {isStarted && !isComplete && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center gap-4 bg-gray-800/90 border border-gray-700 rounded-full px-6 py-3 backdrop-blur">
            <div className="flex items-center gap-2 text-blue-400">
              <Zap className="w-4 h-4" />
              <span className="text-lg font-bold">{stats.wpm}</span>
              <span className="text-sm">WPM</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <Target className="w-4 h-4" />
              <span className="text-lg font-bold">{stats.accuracy}%</span>
              <span className="text-sm">ACC</span>
            </div>
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-lg font-bold">{stats.errors}</span>
              <span className="text-sm">ERR</span>
            </div>
          </div>
        </div>
      )}
      
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
          <div className="text-2xl leading-relaxed font-mono min-h-[8rem] text-center flex flex-wrap justify-center gap-x-1">
            {renderedChars}
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
