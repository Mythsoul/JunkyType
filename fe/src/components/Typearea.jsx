"use client"

import React from "react"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useSelector } from "react-redux"
import { RotateCcw, Zap } from "lucide-react"
import Info from "./Info"
import Options from "./Options"

// Enhanced character component with subtle, elegant cursor
const Character = React.memo(({ char, status, isCurrent, theme }) => {
  const getCharClass = () => {
    if (status === "correct") {
      return "text-emerald-400"
    } else if (status === "incorrect") {
      return "text-red-400"
    } else if (isCurrent) {
      return `${theme === "dark" ? "text-gray-200" : "text-gray-800"}`
    } else {
      return theme === "dark" ? "text-gray-500" : "text-gray-400"
    }
  }

  return (
    <span
      className={`relative inline-block transition-all duration-150 ${getCharClass()} ${
        isCurrent ? "current-char" : ""
      }`}
      style={{
        minWidth: char === " " ? "0.5em" : "auto",
      }}
    >
      {/* Subtle, elegant cursor BEFORE the current character */}
      {isCurrent && (
        <span
          className={`absolute -left-0.5 top-0 w-0.5 h-full rounded-full transition-all duration-300 ${
            theme === "dark"
              ? "bg-gradient-to-b from-emerald-400/80 to-blue-400/80"
              : "bg-gradient-to-b from-emerald-500/70 to-blue-500/70"
          }`}
          style={{
            animation: "gentle-pulse 2s ease-in-out infinite",
            boxShadow: theme === "dark" ? "0 0 8px rgba(52, 211, 153, 0.3)" : "0 0 6px rgba(16, 185, 129, 0.2)",
          }}
        />
      )}

      {char === " " ? "\u00A0" : char}

      {/* Subtle background highlight */}
      {(status === "correct" || status === "incorrect" || isCurrent) && (
        <span
          className={`absolute inset-0 -z-10 rounded-sm transition-all duration-200 ${
            status === "correct"
              ? "bg-emerald-500/10"
              : status === "incorrect"
                ? "bg-red-500/15"
                : `${theme === "dark" ? "bg-blue-500/8" : "bg-blue-500/5"}`
          }`}
        />
      )}
    </span>
  )
})

Character.displayName = "Character"

// Ultra-smooth text display with optimized auto-scrolling
const DisplayText = React.memo(({ targetText, userInput, theme }) => {
  const containerRef = useRef(null)
  const currentCharRef = useRef(null)
  const scrollTimeoutRef = useRef(null)
  const currentIndex = userInput.length

  // Split text into words for better layout
  const words = useMemo(() => {
    const result = []
    let currentWordStart = 0

    targetText.split(" ").forEach((word, idx) => {
      const wordStart = currentWordStart
      const wordEnd = wordStart + word.length
      const isCurrentWordActive = currentIndex >= wordStart && currentIndex < wordEnd

      const wordChars = word.split("").map((char, charIdx) => {
        const absoluteIndex = wordStart + charIdx
        let status = "pending"
        const isCurrent = absoluteIndex === currentIndex

        if (absoluteIndex < userInput.length) {
          status = userInput[absoluteIndex] === char ? "correct" : "incorrect"
        }

        return { char, status, isCurrent, index: absoluteIndex }
      })

      result.push({
        text: word,
        characters: wordChars,
        isActive: isCurrentWordActive,
        wordIndex: idx,
      })

      // Add space after word (except last word)
      if (idx < targetText.split(" ").length - 1) {
        const spaceIndex = wordEnd
        let spaceStatus = "pending"
        const isCurrentSpace = spaceIndex === currentIndex

        if (spaceIndex < userInput.length) {
          spaceStatus = userInput[spaceIndex] === " " ? "correct" : "incorrect"
        }

        result.push({
          text: " ",
          characters: [
            {
              char: " ",
              status: spaceStatus,
              isCurrent: isCurrentSpace,
              index: spaceIndex,
            },
          ],
          isSpace: true,
          wordIndex: `space-${idx}`,
        })

        currentWordStart = wordEnd + 1
      } else {
        currentWordStart = wordEnd
      }
    })

    return result
  }, [targetText, userInput, currentIndex])

  // Ultra-smooth auto-scrolling with requestAnimationFrame
  const smoothScrollToElement = useCallback((element, container) => {
    if (!element || !container) return

    const containerRect = container.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()

    // Calculate the optimal scroll position
    const containerTop = containerRect.top
    const containerBottom = containerRect.bottom
    const elementTop = elementRect.top
    const elementBottom = elementRect.bottom

    // Check if element is outside the visible area
    const isAbove = elementTop < containerTop + 60
    const isBelow = elementBottom > containerBottom - 60

    if (isAbove || isBelow) {
      // Calculate target scroll position to center the element
      const targetScrollTop = container.scrollTop + (elementTop - containerTop) - containerRect.height / 3

      // Use smooth scrolling with easing
      const startScrollTop = container.scrollTop
      const distance = targetScrollTop - startScrollTop
      const duration = 400 // Slightly slower for more elegance
      const startTime = performance.now()

      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeOutCubic(progress)

        container.scrollTop = startScrollTop + distance * easedProgress

        if (progress < 1) {
          requestAnimationFrame(animateScroll)
        }
      }

      requestAnimationFrame(animateScroll)
    }
  }, [])

  // Optimized scroll effect with debouncing
  useEffect(() => {
    if (!containerRef.current || !currentCharRef.current) return

    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Debounce scrolling for smoother experience
    scrollTimeoutRef.current = setTimeout(() => {
      smoothScrollToElement(currentCharRef.current, containerRef.current)
    }, 80) // Slightly longer delay for more elegance

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [currentIndex, smoothScrollToElement])

  // Calculate completion percentage
  const completionPercentage = Math.round((currentIndex / targetText.length) * 100)

  return (
    <div
      className={`rounded-2xl shadow-2xl backdrop-blur-md border-2 transition-all duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border-gray-600/30"
          : "bg-gradient-to-br from-white/80 via-white/60 to-gray-50/80 border-gray-200/50"
      }`}
    >
      {/* Elegant progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200/20 rounded-t-2xl overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 transition-all duration-500 ease-out"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Header with enhanced info */}
      <div
        className={`px-6 py-3 border-b backdrop-blur-sm relative z-10 transition-all duration-300 ${
          theme === "dark" ? "bg-gray-700/30 border-gray-600/30" : "bg-gray-50/50 border-gray-200/30"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentIndex > 0
                  ? `${theme === "dark" ? "bg-emerald-400" : "bg-emerald-500"} shadow-sm`
                  : theme === "dark"
                    ? "bg-gray-500"
                    : "bg-gray-400"
              }`}
              style={{
                animation: currentIndex > 0 ? "gentle-glow 3s ease-in-out infinite" : "none",
              }}
            />
            <span
              className={`text-sm font-medium transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              {currentIndex > 0 ? "Typing..." : "Ready to type"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`text-xs px-3 py-1 rounded-full transition-all duration-300 ${
                theme === "dark" ? "bg-gray-600/40 text-gray-300" : "bg-gray-200/40 text-gray-600"
              }`}
            >
              {completionPercentage}%
            </div>
            <div
              className={`text-xs px-3 py-1 rounded-full transition-all duration-300 ${
                theme === "dark" ? "bg-gray-600/40 text-gray-300" : "bg-gray-200/40 text-gray-600"
              }`}
            >
              {currentIndex}/{targetText.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main text display with ultra-smooth scrolling */}
      <div className="p-8 relative">
        <div
          ref={containerRef}
          className="text-3xl font-mono leading-relaxed tracking-wide relative overflow-hidden"
          style={{
            height: "280px",
            lineHeight: "1.8",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Text with word-based wrapping and smooth scrolling */}
          <div className="flex flex-wrap">
            {words.map((word, idx) => (
              <span
                key={word.wordIndex}
                className={`inline-flex transition-all duration-200 ${
                  word.isActive && !word.isSpace ? `${theme === "dark" ? "word-active-dark" : "word-active-light"}` : ""
                }`}
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {word.characters.map((charData, charIdx) => (
                  <span key={charData.index} ref={charData.isCurrent ? currentCharRef : null}>
                    <Character
                      char={charData.char}
                      status={charData.status}
                      isCurrent={charData.isCurrent}
                      theme={theme}
                    />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Elegant typing progress indicator */}
        {currentIndex > 0 && currentIndex < targetText.length && (
          <div
            className={`absolute bottom-2 right-2 text-xs px-3 py-1 rounded-full transition-all duration-300 ${
              theme === "dark" ? "bg-gray-700/60 text-gray-400" : "bg-gray-200/60 text-gray-500"
            }`}
          >
            {Math.round((currentIndex / targetText.length) * 100)}% complete
          </div>
        )}
      </div>
    </div>
  )
})

DisplayText.displayName = "DisplayText"

function Typearea() {
  const theme = useSelector((state) => state.settings.theme)
  const [startTime, setStartTime] = useState(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [isStarted, setIsStarted] = useState(false)
  const [allWords, setAllWords] = useState([])
  const [words, setWords] = useState([])
  const language = useSelector((state) => state.settings.language)
  const [isLoading, setIsLoading] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [errors, setErrors] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [completionStats, setCompletionStats] = useState(null)
  const textareaRef = useRef(null)
  const targetText = useMemo(() => words.join(" "), [words])

  // Use a ref for performance metrics to avoid re-renders
  const metricsRef = useRef({
    wpmUpdateTime: 0,
    lastInputLength: 0,
  })

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

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        getRandomWords(allWords)
      }
      // Prevent default scrolling behavior for page but allow in typing area
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(e.key)) {
        if (e.target !== textareaRef.current) {
          e.preventDefault()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [allWords])

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
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto h-screen overflow-hidden">
      <div className="lg:w-1/4 order-2 lg:order-1 overflow-hidden">
        <Options />
      </div>

      <div className="lg:w-1/2 order-1 lg:order-2 overflow-hidden">
        <div
          className={`rounded-xl shadow-2xl backdrop-blur-sm border transition-all duration-300 ${
            theme === "dark" ? "bg-gray-800/30 border-gray-700/50" : "bg-white/50 border-gray-200/50"
          }`}
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <h1
                className={`text-5xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${
                  theme === "dark" ? "from-emerald-400 to-blue-400" : "from-emerald-600 to-blue-600"
                }`}
              >
                JunkeyType
              </h1>

              <div className="flex justify-center items-center gap-6 flex-wrap">
                <p
                  className={`text-lg transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                >
                  Test your typing speed
                </p>
                {isStarted && (
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        theme === "dark" ? "bg-blue-500/15 text-blue-400" : "bg-blue-500/8 text-blue-600"
                      }`}
                    >
                      <Zap className="w-5 h-5" />
                      <span className="text-2xl font-bold">{wpm}</span>
                      <span className="text-sm">WPM</span>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        accuracy >= 95
                          ? theme === "dark"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-emerald-500/8 text-emerald-600"
                          : accuracy >= 90
                            ? theme === "dark"
                              ? "bg-yellow-500/15 text-yellow-400"
                              : "bg-yellow-500/8 text-yellow-600"
                            : theme === "dark"
                              ? "bg-red-500/15 text-red-400"
                              : "bg-red-500/8 text-red-600"
                      }`}
                    >
                      <span className="text-lg font-bold">{accuracy}%</span>
                      <span className="text-sm ml-1">ACC</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                <div
                  className={`ml-4 text-xl transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                >
                  Loading words...
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Enhanced completion message */}
                {isComplete && completionStats && (
                  <div
                    className={`text-center p-6 rounded-xl border-2 transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-emerald-500/15 to-blue-500/15 border-emerald-500/30 text-emerald-400"
                        : "bg-gradient-to-r from-emerald-500/8 to-blue-500/8 border-emerald-500/30 text-emerald-600"
                    }`}
                  >
                    <div className="text-3xl font-bold mb-2">🎉 Test Complete!</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <div className="text-2xl font-bold">{completionStats.wpm}</div>
                        <div className="text-sm opacity-75">WPM</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{completionStats.accuracy}%</div>
                        <div className="text-sm opacity-75">Accuracy</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{completionStats.errors}</div>
                        <div className="text-sm opacity-75">Errors</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{Math.round(completionStats.timeElapsed)}s</div>
                        <div className="text-sm opacity-75">Time</div>
                      </div>
                    </div>
                    <div className="text-sm mt-3 opacity-75">Loading new words...</div>
                  </div>
                )}

                {/* Ultra-smooth text display with optimized auto-scrolling */}
                <DisplayText targetText={targetText} userInput={userInput} theme={theme} />

                <div className="space-y-4">
                  {/* Input area */}
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      aria-label="Type here"
                      placeholder="Click here and start typing... Elegant auto-scrolling enabled!"
                      className={`w-full h-32 px-6 py-4 rounded-xl border-2 text-xl font-mono 
                              outline-none shadow-lg transition-all duration-200 resize-none
                              ${
                                theme === "dark"
                                  ? "bg-gray-700/40 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10 focus:bg-gray-700/60"
                                  : "bg-white/60 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-600/60 focus:ring-4 focus:ring-emerald-600/10 focus:bg-white/80"
                              }`}
                      onChange={handleInput}
                      value={userInput}
                      onDragStart={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      autoFocus
                      style={{ caretColor: "transparent" }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div
                      className={`text-sm transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Press{" "}
                      <kbd
                        className={`px-2 py-1 rounded font-mono transition-colors duration-300 ${
                          theme === "dark"
                            ? "bg-gray-700/60 text-gray-300 border border-gray-600/60"
                            : "bg-gray-200/60 text-gray-700 border border-gray-300/60"
                        }`}
                      >
                        ESC
                      </kbd>{" "}
                      for new words • Elegant auto-scroll
                    </div>

                    <button
                      onClick={() => getRandomWords(allWords)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        theme === "dark"
                          ? "bg-gray-700/60 hover:bg-gray-600/60 text-gray-300 hover:text-white"
                          : "bg-gray-200/60 hover:bg-gray-300/60 text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:w-1/4 order-3 overflow-hidden">
        <Info wpm={wpm} accuracy={accuracy} errors={errors} isStarted={isStarted} />
      </div>
    </div>
  )
}

export default Typearea
