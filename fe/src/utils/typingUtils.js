
export function calculateWPM(correctCharacters, timeMs, useNetWPM = true) {
  if (!timeMs || correctCharacters === 0) return 0
  const minutes = timeMs / 60000
  const words = correctCharacters / 5 // Standard: 5 characters = 1 word
  return Math.round(words / minutes)
}

/**
 * Calculate Raw WPM (includes incorrect characters)
 */
export function calculateRawWPM(totalCharacters, timeMs) {
  if (!timeMs || totalCharacters === 0) return 0
  const minutes = timeMs / 60000
  const words = totalCharacters / 5
  return Math.round(words / minutes)
}

/**
 * Calculate typing accuracy
 */
export function calculateAccuracy(correctCharacters, totalCharacters) {
  if (totalCharacters === 0) return 100
  return Math.round((correctCharacters / totalCharacters) * 100)
}

/**
 * Calculate error count and error rate
 */
export function calculateErrors(inputText, targetText) {
  let errors = 0
  let correct = 0
  
  for (let i = 0; i < inputText.length; i++) {
    if (i < targetText.length && inputText[i] === targetText[i]) {
      correct++
    } else {
      errors++
    }
  }
  
  console.log('calculateErrors debug:', {
    inputLength: inputText.length,
    targetLength: targetText.length,
    correct,
    errors,
    inputText: inputText.substring(0, 20) + '...',
    targetText: targetText.substring(0, 20) + '...'
  })
  
  return {
    errors,
    correct,
    errorRate: inputText.length > 0 ? (errors / inputText.length) * 100 : 0
  }
}

/**
 * Calculate comprehensive typing statistics
 */
export function calculateTypingStats(inputText, targetText, startTime, endTime) {
  const timeMs = endTime - startTime
  const { errors, correct } = calculateErrors(inputText, targetText)
  
  const stats = {
    // Basic metrics
    charactersTyped: inputText.length,
    correctCharacters: correct,
    errors: errors,
    time: Math.round(timeMs / 1000),
    timeMs: timeMs,
    
    // WPM calculations
    wpm: calculateWPM(correct, timeMs),
    rawWPM: calculateRawWPM(inputText.length, timeMs),
    
    // Accuracy
    accuracy: calculateAccuracy(correct, inputText.length),
    
    // Additional metrics
    wordsTyped: Math.floor(inputText.length / 5),
    targetWords: Math.floor(targetText.length / 5),
    errorRate: inputText.length > 0 ? Math.round((errors / inputText.length) * 100) : 0,
    
    // Performance indicators
    consistency: calculateConsistency(inputText, targetText),
    speed: calculateSpeed(timeMs, inputText.length)
  }
  
  console.log('calculateTypingStats debug:', {
    inputLength: inputText.length,
    correct,
    errors,
    calculatedAccuracy: stats.accuracy,
    mathCheck: `${correct}/${inputText.length} = ${(correct/inputText.length*100).toFixed(1)}%`
  })
  
  return stats
}

/**
 * Calculate typing consistency (how steady the typing rhythm is)
 */
export function calculateConsistency(inputText, targetText) {
  // Simple consistency metric based on error distribution
  if (inputText.length < 10) return 100
  
  const segments = 5
  const segmentSize = Math.floor(inputText.length / segments)
  const segmentAccuracies = []
  
  for (let i = 0; i < segments; i++) {
    const start = i * segmentSize
    const end = Math.min(start + segmentSize, inputText.length)
    const segmentInput = inputText.slice(start, end)
    const segmentTarget = targetText.slice(start, end)
    
    let segmentCorrect = 0
    for (let j = 0; j < segmentInput.length; j++) {
      if (j < segmentTarget.length && segmentInput[j] === segmentTarget[j]) {
        segmentCorrect++
      }
    }
    
    const segmentAccuracy = segmentInput.length > 0 ? (segmentCorrect / segmentInput.length) * 100 : 100
    segmentAccuracies.push(segmentAccuracy)
  }
  
  // Calculate standard deviation of segment accuracies
  const mean = segmentAccuracies.reduce((sum, acc) => sum + acc, 0) / segmentAccuracies.length
  const variance = segmentAccuracies.reduce((sum, acc) => sum + Math.pow(acc - mean, 2), 0) / segmentAccuracies.length
  const stdDev = Math.sqrt(variance)
  
  // Convert to consistency score (lower std dev = higher consistency)
  return Math.max(0, Math.round(100 - stdDev))
}

/**
 * Calculate typing speed category
 */
export function calculateSpeed(timeMs, charactersTyped) {
  const cps = charactersTyped / (timeMs / 1000) // Characters per second
  return Math.round(cps * 10) / 10 // Round to 1 decimal place
}

/**
 * Get performance level based on WPM
 */
export function getPerformanceLevel(wpm) {
  if (wpm >= 80) return { level: 'Expert', color: 'purple', icon: '🚀' }
  if (wpm >= 60) return { level: 'Advanced', color: 'blue', icon: '💪' }
  if (wpm >= 40) return { level: 'Intermediate', color: 'green', icon: '📈' }
  if (wpm >= 20) return { level: 'Developing', color: 'yellow', icon: '🌱' }
  return { level: 'Beginner', color: 'gray', icon: '🎯' }
}

/**
 * Calculate live typing statistics (for real-time updates)
 */
export function calculateLiveStats(inputText, targetText, startTime) {
  if (!startTime) return { wpm: 0, accuracy: 100, errors: 0 }
  
  const currentTime = Date.now()
  const timeMs = currentTime - startTime
  
  if (timeMs < 1000 || inputText.length === 0) {
    return { wpm: 0, accuracy: 100, errors: 0 }
  }
  
  const { errors, correct } = calculateErrors(inputText, targetText)
  
  return {
    wpm: calculateWPM(correct, timeMs),
    accuracy: calculateAccuracy(correct, inputText.length),
    errors: errors,
    rawWPM: calculateRawWPM(inputText.length, timeMs),
    cps: calculateSpeed(timeMs, inputText.length)
  }
}

/**
 * Validate typing input
 */
export function validateInput(inputChar, targetChar, allowMistakes = true) {
  if (!allowMistakes && inputChar !== targetChar) {
    return false
  }
  return true
}

/**
 * Calculate burst typing speed (speed over short intervals)
 */
export function calculateBurstSpeed(recentInputs, timeWindow = 3000) {
  if (recentInputs.length < 2) return 0
  
  const now = Date.now()
  const recentChars = recentInputs.filter(input => now - input.timestamp <= timeWindow)
  
  if (recentChars.length < 2) return 0
  
  const timeSpan = recentChars[recentChars.length - 1].timestamp - recentChars[0].timestamp
  const charCount = recentChars.length
  
  if (timeSpan === 0) return 0
  
  const cps = charCount / (timeSpan / 1000)
  const wpm = (cps * 60) / 5 // Convert to WPM
  
  return Math.round(wpm)
}

export default {
  calculateWPM,
  calculateRawWPM,
  calculateAccuracy,
  calculateErrors,
  calculateTypingStats,
  calculateConsistency,
  calculateSpeed,
  getPerformanceLevel,
  calculateLiveStats,
  validateInput,
  calculateBurstSpeed
}
