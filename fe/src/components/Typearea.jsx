"use client"

import React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useSelector } from "react-redux"
import { RotateCcw, Zap, Target, AlertCircle } from "lucide-react"

// Lightweight character component with minimal DOM manipulation
const Character = React.memo(({ char, status, isCurrent }) => {
  return (
    <span 
      className={`relative font-mono ${
        status === "correct" ? "text-green-400" :
        status === "incorrect" ? "text-red-400" :
        isCurrent ? "text-white bg-white/20" :
        "text-gray-500"
      }`}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  )
})

Character.displayName = "Character"


function Typearea() {
  const theme = useSelector((state) => state.settings.theme)
  const language = useSelector((state) => state.settings.language)
  
  // Core state - minimal re-renders
  const [words, setWords] = useState([])
  const [userInput, setUserInput] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Performance metrics - updated via refs to avoid re-renders
  const [liveStats, setLiveStats] = useState({ wpm: 0, accuracy: 100, errors: 0 })
  const [completionStats, setCompletionStats] = useState(null)
  
  // Refs for performance
  const allWordsRef = useRef([])
  const startTimeRef = useRef(null)
  const statsUpdateRef = useRef(null)
  const targetTextRef = useRef("")
  const correctCharsRef = useRef(0)
  const totalCharsRef = useRef(0)
  
  // Update target text when words change
  useEffect(() => {
    targetTextRef.current = words.join(" ")
  }, [words])

  // Prevent page scrolling but allow typing area scrolling
  useEffect(() => {
    // Disable scrolling on the body but allow it in specific containers
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"

    return () => {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = "auto"
      document.documentElement.style.overflow = "auto"
    }
  }, [])

  // Fetch words only once on mount or language change
  useEffect(() => {
    const fetchWords = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          `https://api.allorigins.win/raw?url=https://monkeytype.com/languages/${language}.json`,
        )
        const data = await response.json()
        if (data.words) {
          setAllWords(data.words)
          await getRandomWords(data.words)
        }
      } catch (error) {
        console.error("Error fetching words:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchWords()
  }, [language])

  // Optimized WPM calculation
  const calculateWPM = useCallback((text, startTimeMs) => {
    if (!startTimeMs || text.length === 0) return 0
    const timeElapsed = (Date.now() - startTimeMs) / 1000 / 60 // minutes
    const words = text.length / 5 // standard word length
    return Math.round(words / timeElapsed)
  }, [])

  // Optimized accuracy calculation
  const calculateAccuracy = useCallback((userText, targetText) => {
    if (!userText || userText.length === 0) return 100

    let correctChars = 0
    const minLength = Math.min(userText.length, targetText.length)

    for (let i = 0; i < minLength; i++) {
      if (userText[i] === targetText[i]) {
        correctChars++
      }
    }

    return Math.round((correctChars / userText.length) * 100)
  }, [])

  // Ultra-smooth input handler with optimized updates
  const handleInput = useCallback(
    (e) => {
      const value = e.target.value

      // Prevent typing beyond target text length
      if (value.length > targetText.length) {
        // Auto-complete when user reaches the end
        if (!isComplete) {
          const finalWpm = calculateWPM(value.slice(0, targetText.length), startTime || Date.now())
          const finalAccuracy = calculateAccuracy(value.slice(0, targetText.length), targetText)
          const finalErrors =
            targetText.length -
            value
              .slice(0, targetText.length)
              .split("")
              .filter((char, i) => char === targetText[i]).length

          setCompletionStats({
            wpm: finalWpm,
            accuracy: finalAccuracy,
            errors: finalErrors,
            timeElapsed: startTime ? (Date.now() - startTime) / 1000 : 0,
          })

          setIsComplete(true)
          setTimeout(() => {
            getRandomWords(allWords)
            setIsComplete(false)
            setCompletionStats(null)
          }, 3000)
        }
        return
      }

      setUserInput(value)

      // Start timer on first character
      if (!isStarted && value.length === 1) {
        setStartTime(Date.now())
        setIsStarted(true)
      }

      if (!value) {
        setIsStarted(false)
        setWpm(0)
        setAccuracy(100)
        setErrors(0)
        return
      }

      // Ultra-frequent updates for smoothest experience
      const now = Date.now()
      if (
        now - metricsRef.current.wpmUpdateTime > 50 || // Slightly slower for elegance
        Math.abs(value.length - metricsRef.current.lastInputLength) > 1 // Update on every character
      ) {
        // Calculate metrics
        const newWpm = calculateWPM(value, startTime || Date.now())
        const newAccuracy = calculateAccuracy(value, targetText)
        const newErrors = value.length - value.split("").filter((char, i) => char === targetText[i]).length

        // Update state
        setWpm(newWpm)
        setAccuracy(newAccuracy)
        setErrors(newErrors)

        // Update metrics ref
        metricsRef.current = {
          wpmUpdateTime: now,
          lastInputLength: value.length,
        }
      }

      // Auto-complete when reaching the end of target text
      if (value.length === targetText.length && !isComplete) {
        const finalWpm = calculateWPM(value, startTime || Date.now())
        const finalAccuracy = calculateAccuracy(value, targetText)
        const finalErrors = value.length - value.split("").filter((char, i) => char === targetText[i]).length

        setCompletionStats({
          wpm: finalWpm,
          accuracy: finalAccuracy,
          errors: finalErrors,
          timeElapsed: startTime ? (Date.now() - startTime) / 1000 : 0,
        })

        setIsComplete(true)
        setTimeout(() => {
          getRandomWords(allWords)
          setIsComplete(false)
          setCompletionStats(null)
        }, 3000)
      }
    },
    [isStarted, targetText, startTime, allWords, calculateWPM, calculateAccuracy, isComplete],
  )

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in an input/textarea element
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return
      }
      
      if (e.key === "Escape") {
        getRandomWords(allWords)
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        handleInput({ target: { value: userInput.slice(0, -1) } })
      } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault()
        handleInput({ target: { value: userInput + e.key } })
      }
      
      // Prevent default scrolling behavior for page
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", "Space"].includes(e.key)) {
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [allWords, userInput, handleInput])

  // Optimized random words generator
  const getRandomWords = useCallback(async (wordList) => {
    try {
      if (!wordList?.length) return

      // Generate optimal number of words for smooth scrolling
      const randomWords = []
      for (let i = 0; i < 40; i++) {
        // More words for better scrolling experience
        const randomIndex = Math.floor(Math.random() * wordList.length)
        randomWords.push(wordList[randomIndex])
      }

      // Reset state
      setWords(randomWords)
      setUserInput("")
      setStartTime(null)
      setWpm(0)
      setAccuracy(100)
      setErrors(0)
      setIsStarted(false)
      setIsComplete(false)
      setCompletionStats(null)

      // Focus textarea after generating new words
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
        }
      }, 100)
    } catch (err) {
      console.error("Error generating words:", err)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 max-w-6xl mx-auto">
      {/* Clean top stats bar when typing */}
      {isStarted && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`flex items-center gap-6 px-6 py-3 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 ${
            theme === "dark" ? "bg-gray-800/80 border-gray-600/50" : "bg-white/80 border-gray-200/50"
          }`}>
            <div className={`flex items-center gap-2 text-sm font-medium ${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}>
              <Zap className="w-4 h-4" />
              <span className="text-xl font-bold">{wpm}</span>
              <span>WPM</span>
            </div>
            
            <div className={`flex items-center gap-2 text-sm font-medium ${
              accuracy >= 95 ? (theme === "dark" ? "text-emerald-400" : "text-emerald-600")
              : accuracy >= 90 ? (theme === "dark" ? "text-yellow-400" : "text-yellow-600")
              : (theme === "dark" ? "text-red-400" : "text-red-600")
            }`}>
              <Target className="w-4 h-4" />
              <span className="text-xl font-bold">{accuracy}%</span>
              <span>ACC</span>
            </div>
            
            <div className={`flex items-center gap-2 text-sm font-medium ${
              theme === "dark" ? "text-red-400" : "text-red-600"
            }`}>
              <AlertCircle className="w-4 h-4" />
              <span className="text-xl font-bold">{errors}</span>
              <span>ERR</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content area */}
      <div className="w-full max-w-5xl mx-auto space-y-12">
        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
            <div className={`ml-6 text-2xl font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Loading words...
            </div>
          </div>
        ) : (
          <>
            {/* Results overlay */}
            {isComplete && completionStats && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className={`max-w-2xl w-full mx-4 p-8 rounded-2xl shadow-2xl border-2 text-center transition-all duration-300 ${
                  theme === "dark" 
                    ? "bg-gray-800/95 border-emerald-500/50 text-white" 
                    : "bg-white/95 border-emerald-500/50 text-gray-900"
                }`}>
                  <div className="text-6xl mb-6">🎉</div>
                  <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    Test Complete!
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div className={`p-4 rounded-xl ${
                      theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
                    }`}>
                      <div className="text-4xl font-bold text-blue-500 mb-2">{completionStats.wpm}</div>
                      <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>WPM</div>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${
                      theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
                    }`}>
                      <div className="text-4xl font-bold text-emerald-500 mb-2">{completionStats.accuracy}%</div>
                      <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Accuracy</div>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${
                      theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
                    }`}>
                      <div className="text-4xl font-bold text-red-500 mb-2">{completionStats.errors}</div>
                      <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Errors</div>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${
                      theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
                    }`}>
                      <div className="text-4xl font-bold text-purple-500 mb-2">{Math.round(completionStats.timeElapsed)}s</div>
                      <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Time</div>
                    </div>
                  </div>
                  
                  <div className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Starting new test in 3 seconds...
                  </div>
                </div>
              </div>
            )}
            
            {/* Main typing area */}
            <div className="space-y-8">
              {/* Clean text display */}
              <div className="w-full max-w-4xl mx-auto">
                <div
                  className={`relative w-full p-12 rounded-2xl transition-all duration-300 cursor-text focus:outline-none ${
                    theme === "dark"
                      ? "bg-gray-800/40 hover:bg-gray-800/60 focus:bg-gray-800/80"
                      : "bg-white/40 hover:bg-white/60 focus:bg-white/80"
                  }`}
                  tabIndex={0}
                  onFocus={() => {
                    // Just ensure we're focused for keyboard events
                  }}
                >
                  {/* Text display */}
                  <div className="text-2xl md:text-3xl font-mono leading-relaxed text-center max-h-96 overflow-hidden">
                    <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                      {words.map((word, wordIdx) => {
                        const wordStartIndex = words.slice(0, wordIdx).join(' ').length + (wordIdx > 0 ? 1 : 0)
                        return (
                          <span key={wordIdx} className="inline-flex">
                            {word.split('').map((char, charIdx) => {
                              const absoluteIndex = wordStartIndex + charIdx
                              const isCurrent = absoluteIndex === userInput.length
                              let status = 'pending'
                              
                              if (absoluteIndex < userInput.length) {
                                status = userInput[absoluteIndex] === char ? 'correct' : 'incorrect'
                              }
                              
                              return (
                                <Character
                                  key={absoluteIndex}
                                  char={char}
                                  status={status}
                                  isCurrent={isCurrent}
                                  theme={theme}
                                />
                              )
                            })}
                            {wordIdx < words.length - 1 && (
                              <Character
                                key={`space-${wordIdx}`}
                                char=" "
                                status={userInput.length > wordStartIndex + word.length ? 'correct' : 'pending'}
                                isCurrent={userInput.length === wordStartIndex + word.length}
                                theme={theme}
                              />
                            )}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Subtle hint */}
                  {!isStarted && (
                    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${
                      userInput.length > 0 ? 'opacity-0' : 'opacity-100'
                    }`}>
                      <div className={`text-lg font-medium ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                        Start typing to begin
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bottom controls */}
              <div className="flex justify-center items-center gap-6 pt-8">
                <button
                  onClick={() => getRandomWords(allWords)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-gray-700/60 hover:bg-gray-600/80 text-gray-300 hover:text-white"
                      : "bg-gray-200/60 hover:bg-gray-300/80 text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  New Test
                </button>
                
                <div className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                  Press <kbd className={`px-2 py-1 rounded font-mono text-xs ${
                    theme === "dark" ? "bg-gray-700/60 text-gray-300" : "bg-gray-200/60 text-gray-600"
                  }`}>ESC</kbd> for new test
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Typearea
