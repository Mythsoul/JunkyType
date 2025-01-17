import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Brain, TrendingUp, Target, AlertTriangle, Lightbulb, BarChart3, Zap, RefreshCw } from 'lucide-react'
import { createTypingAnalysisPrompt, createMistakeAnalysisPrompt } from '../utils/aiPrompts'

function AIAnalysis() {
  const navigate = useNavigate()
  const location = useLocation()
  const userStats = useSelector(state => state.userStats)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [aiResponse, setAiResponse] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  // Get test data from location state (passed from modal) or from userStats
  const testDataFromModal = location.state?.testResult
  const recentTests = userStats.testHistory?.slice(-10) || []
  const latestTest = testDataFromModal || recentTests[recentTests.length - 1]

  console.log('Test data from modal:', testDataFromModal)
  console.log('Latest test from history:', recentTests[recentTests.length - 1])
  console.log('Using test data:', latestTest)

  useEffect(() => {
    generateAnalysis()
  }, [])

  const generateAnalysis = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!latestTest) {
        setError("No test data available. Please complete a typing test first.")
        setLoading(false)
        return
      }

      console.log('Analyzing test:', latestTest)

      const localAnalysis = analyzeTypingPerformance(latestTest, recentTests)
      setAnalysis(localAnalysis)
      setLoading(false)
      
      // Auto-generate AI insights
      await getAIInsights(latestTest, recentTests)
    } catch (err) {
      console.error('Analysis error:', err)
      setError("Failed to generate analysis.")
      setLoading(false)
    }
  }

  const getAIInsights = async (latest, history) => {
    setAiLoading(true)
    try {
      const avgWPM = history.length > 0 ? history.reduce((sum, test) => sum + test.wpm, 0) / history.length : latest.wpm
      const avgAccuracy = history.length > 0 ? history.reduce((sum, test) => sum + test.accuracy, 0) / history.length : latest.accuracy
      
      // Prepare comprehensive data for AI analysis
      const testData = {
        wpm: latest.wpm,
        accuracy: latest.accuracy,
        errors: latest.errors,
        time: latest.time,
        testType: latest.testType,
        charactersTyped: latest.charactersTyped || 0,
        correctCharacters: latest.correctCharacters || Math.round((latest.charactersTyped || 0) * (latest.accuracy / 100))
      }

      const historyData = {
        avgWPM: Math.round(avgWPM),
        avgAccuracy: Math.round(avgAccuracy),
        recentTests: history.slice(-5),
        totalTests: history.length
      }

      // Use the comprehensive prompt system
      const prompt = createTypingAnalysisPrompt(testData, historyData)

      const aiInsight = await callOpenRouter(prompt)
      setAiResponse(aiInsight)
    } catch (error) {
      console.error('AI analysis error:', error)
      setAiResponse(generateFallbackAnalysis(latest, history))
    } finally {
      setAiLoading(false)
    }
  }

  const callOpenRouter = async (prompt) => {
    try {
      console.log('Calling OpenRouter API...')
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'JunkyType - Typing Analysis'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            {
              role: 'system',
              content: 'You are an expert typing coach and performance analyst. Provide helpful, encouraging, and actionable advice to improve typing skills. Be concise and use emojis.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      })

      console.log('OpenRouter response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('OpenRouter API error:', response.status, errorText)
        throw new Error(`OpenRouter API error: ${response.status}`)
      }

      const data = await response.json()
      console.log('OpenRouter response:', data)
      
      const aiContent = data.choices[0]?.message?.content
      if (aiContent) {
        return aiContent
      } else {
        throw new Error('No content in AI response')
      }
    } catch (error) {
      console.error('OpenRouter API call failed:', error)
      throw error
    }
  }

  const generateFallbackAnalysis = (latest, history) => {
    const avgWPM = history.length > 0 ? history.reduce((sum, test) => sum + test.wpm, 0) / history.length : latest.wpm
    
    let analysis = "🤖 **Performance Analysis** (Fallback Mode)\n\n"
    
    // Performance Level Assessment
    if (latest.wpm >= 80) {
      analysis += "**🚀 EXPERT LEVEL**\n"
      analysis += `${latest.wpm} WPM is exceptional! You're in the top 5% of typists.\n\n`
    } else if (latest.wpm >= 60) {
      analysis += "**💪 ADVANCED LEVEL**\n"
      analysis += `${latest.wpm} WPM is well above average. Great job!\n\n`
    } else if (latest.wpm >= 40) {
      analysis += "**📈 INTERMEDIATE LEVEL**\n"
      analysis += `${latest.wpm} WPM shows solid progress. Keep it up!\n\n`
    } else if (latest.wpm >= 20) {
      analysis += "**🌱 DEVELOPING**\n"
      analysis += `${latest.wpm} WPM is a good start. Focus on consistency.\n\n`
    } else {
      analysis += "**🎯 BEGINNER**\n"
      analysis += `${latest.wpm} WPM - everyone starts somewhere! Practice daily.\n\n`
    }

    // Accuracy Assessment
    if (latest.accuracy >= 95) {
      analysis += "**🎯 EXCELLENT ACCURACY**\n"
      analysis += `${latest.accuracy}% accuracy is outstanding!\n\n`
    } else if (latest.accuracy >= 85) {
      analysis += "**✅ GOOD ACCURACY**\n"
      analysis += `${latest.accuracy}% accuracy is solid. Minor improvements needed.\n\n`
    } else {
      analysis += "**⚠️ ACCURACY FOCUS NEEDED**\n"
      analysis += `${latest.accuracy}% accuracy needs work. Slow down and focus on correctness.\n\n`
    }

    // Recommendations
    analysis += "**🎯 RECOMMENDATIONS:**\n"
    
    if (latest.accuracy < 90) {
      analysis += "• Slow down 15% and focus on accuracy first\n"
    }
    if (latest.errors > 5) {
      analysis += "• Practice common letter combinations daily\n"
    }
    if (latest.wpm < 40) {
      analysis += "• Practice 15-20 minutes daily with proper posture\n"
    }
    if (latest.wpm >= 50) {
      analysis += "• Try longer texts to build endurance\n"
    }
    
    analysis += "• Take breaks every 10 minutes to prevent fatigue\n"
    analysis += "• Focus on rhythm and consistency over pure speed\n\n"

    analysis += "**💡 Keep practicing - improvement comes with consistency!**"

    return analysis
  }

  const analyzeTypingPerformance = (latest, history) => {
    const avgWPM = history.length > 0 ? history.reduce((sum, test) => sum + test.wpm, 0) / history.length : latest.wpm
    const avgAccuracy = history.length > 0 ? history.reduce((sum, test) => sum + test.accuracy, 0) / history.length : latest.accuracy
    
    const getPerformanceLevel = (wpm) => {
      if (wpm >= 70) return { level: 'Expert', color: 'text-purple-400', bg: 'bg-purple-500/20', icon: '🚀' }
      if (wpm >= 50) return { level: 'Advanced', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: '💪' }
      if (wpm >= 30) return { level: 'Intermediate', color: 'text-green-400', bg: 'bg-green-500/20', icon: '📈' }
      return { level: 'Developing', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: '🌱' }
    }

    const performance = getPerformanceLevel(latest.wpm)
    const insights = []
    const recommendations = []
    const strengths = []
    const weaknesses = []

    // Analyze strengths
    if (latest.wpm > avgWPM + 3) {
      strengths.push("Speed is improving consistently!")
      insights.push("You're performing above your average - excellent momentum!")
    }
    if (latest.accuracy >= 95) {
      strengths.push("Excellent accuracy and precision")
    }
    if (latest.errors <= 2) {
      strengths.push("Very few errors - great control!")
    }

    // Analyze weaknesses
    if (latest.accuracy < 85) {
      weaknesses.push("Accuracy needs improvement")
      recommendations.push("Slow down 15% and focus on correct finger placement")
    }
    if (latest.errors > 8) {
      weaknesses.push("High error count detected")
      recommendations.push("Practice difficult letter combinations daily")
    }
    if (history.length > 0 && latest.wpm < avgWPM - 5) {
      weaknesses.push("Speed dropped below average this session")
      recommendations.push("Take regular breaks and maintain consistent practice")
    }

    // General recommendations
    if (latest.wpm < 30) {
      recommendations.push("Practice 15-20 minutes daily focusing on proper finger placement")
      recommendations.push("Use typing games to make practice more engaging")
    } else if (latest.wpm < 50) {
      recommendations.push("Practice common word combinations and phrases")
      recommendations.push("Work on maintaining rhythm between words")
    } else {
      recommendations.push("Challenge yourself with technical texts and punctuation")
      recommendations.push("Focus on maintaining speed during longer typing sessions")
    }

    if (recommendations.length === 0) {
      recommendations.push("Continue regular practice to maintain improvement")
      recommendations.push("Try different text types to challenge yourself")
    }

    return {
      performance,
      insights,
      recommendations,
      strengths,
      weaknesses,
      stats: {
        currentWPM: latest.wpm,
        averageWPM: Math.round(avgWPM),
        currentAccuracy: latest.accuracy,
        averageAccuracy: Math.round(avgAccuracy),
        improvement: history.length > 0 ? Math.round(latest.wpm - avgWPM) : 0,
        totalTests: history.length,
        consistencyScore: history.length >= 3 ? Math.max(0, 100 - Math.sqrt(history.reduce((sum, test) => sum + Math.pow(test.wpm - avgWPM, 2), 0) / history.length)) : 85
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Typing Test
          </button>
          <div className="text-center py-20">
            <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold mb-4">🤖 Analyzing Performance...</h2>
            <p className="text-gray-400">Processing your typing data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Typing Test
          </button>
          <div className="text-center py-20">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4 text-red-400">Analysis Not Available</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button 
              onClick={() => navigate('/')} 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Take a Typing Test First
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Typing Test
          </button>
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold">AI Performance Analysis</h1>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Performance Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{analysis.stats.currentWPM}</div>
                <div className="text-sm text-gray-400">Current WPM</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{analysis.stats.currentAccuracy}%</div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{analysis.stats.averageWPM}</div>
                <div className="text-sm text-gray-400">Avg WPM</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${analysis.stats.improvement >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {analysis.stats.improvement >= 0 ? '+' : ''}{analysis.stats.improvement}
                </div>
                <div className="text-sm text-gray-400">Improvement</div>
              </div>
            </div>
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${analysis.performance.bg} ${analysis.performance.color} font-medium`}>
              <span className="mr-2">{analysis.performance.icon}</span>
              {analysis.performance.level} Typist
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Tests:</span>
                <span className="font-medium">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Accuracy:</span>
                <span className="font-medium">{latestTest.accuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Consistency:</span>
                <span className="font-medium">{Math.round(latestTest.consistencyScore)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-purple-400">
              <Brain className="w-5 h-5" />
              AI-Powered Insights
            </h3>
            <button
              onClick={() => getAIInsights(latestTest, recentTests)}
              disabled={aiLoading}
              className="flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 rounded-lg text-sm transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${aiLoading ? 'animate-spin' : ''}`} />
              {aiLoading ? 'Analyzing...' : 'Refresh AI'}
            </button>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-6">
            {aiLoading ? (
              <div className="flex items-center gap-3 text-gray-400">
                <div className="animate-spin w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full"></div>
                <span>AI is analyzing your performance patterns...</span>
              </div>
            ) : aiResponse ? (
              <div className="prose prose-invert max-w-none">
                <div className="space-y-8">
                  {aiResponse.split('\n\n').map((section, index) => {
                    const lines = section.split('\n').filter(line => line.trim())
                    if (lines.length === 0) return null
                    
                    const title = lines[0]
                    const content = lines.slice(1)
                    
                    // Clean title
                    const cleanTitle = title.replace(/\*\*/g, '').replace(/🎯|📊|🤔|👏|💡|⚠️|🔧/g, '').trim()
                    
                    return (
                      <div key={index} className="space-y-4">
                        {/* Section Title */}
                        <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                          {title.includes('Performance Level') || title.includes('REPORT') ? '🎯' :
                           title.includes('Error') || title.includes('Improvement') ? '⚠️' :
                           title.includes('Motivational') || title.includes('Congratulations') ? '🎉' :
                           title.includes('Technical') || title.includes('Actionable') ? '🔧' : '💡'}
                          <span>{cleanTitle}</span>
                        </h3>
                        
                        {/* Section Content */}
                        <div className="ml-8 space-y-3">
                          {content.map((line, lineIndex) => {
                            const cleanLine = line.trim()
                            if (!cleanLine) return null
                            
                            if (cleanLine.startsWith('*') || cleanLine.startsWith('•')) {
                              return (
                                <div key={lineIndex} className="flex items-start gap-3 text-gray-300">
                                  <span className="text-purple-400 mt-1.5 text-xs">●</span>
                                  <span className="leading-relaxed">
                                    {cleanLine.replace(/^\*\s*/, '').replace(/^\•\s*/, '').replace(/\*\*/g, '')}
                                  </span>
                                </div>
                              )
                            } else if (cleanLine.match(/^\d+\./)) {
                              return (
                                <div key={lineIndex} className="flex items-start gap-3 text-gray-300">
                                  <span className="text-blue-400 font-medium min-w-[20px]">
                                    {cleanLine.match(/^\d+/)[0]}.
                                  </span>
                                  <span className="leading-relaxed">
                                    {cleanLine.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '')}
                                  </span>
                                </div>
                              )
                            } else {
                              return (
                                <p key={lineIndex} className="text-gray-300 leading-relaxed">
                                  {cleanLine.replace(/\*\*/g, '')}
                                </p>
                              )
                            }
                          })}
                        </div>
                        
                        {/* Subtle divider between sections */}
                        {index < aiResponse.split('\n\n').length - 1 && (
                          <div className="border-t border-gray-700/50 pt-2"></div>
                        )}
                      </div>
                    )
                  })}
                </div>
                
                {/* Clean summary at the bottom */}
                <div className="mt-12 pt-6 border-t border-gray-700/50">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>💡 Keep practicing consistently for best results</span>
                    <span>Generated by AI Coach</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🤖</div>
                <p className="text-gray-400 text-lg">Click "Refresh AI" to get personalized insights!</p>
                <p className="text-gray-500 text-sm mt-2">Our AI coach will analyze your performance and provide tailored recommendations</p>
              </div>
            )}
          </div>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-400">
              <Target className="w-5 h-5" />
              Strengths
            </h3>
            {analysis.strengths.length > 0 ? (
              <ul className="space-y-3">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-gray-300">{strength}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">Keep practicing to develop strengths!</p>
            )}
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Areas for Improvement
            </h3>
            {analysis.weaknesses.length > 0 ? (
              <ul className="space-y-3">
                {analysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">!</span>
                    <span className="text-gray-300">{weakness}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">Great job! No major weaknesses detected.</p>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-yellow-400">
            <Lightbulb className="w-5 h-5" />
            Personalized Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-700/50 rounded-lg">
                <span className="text-yellow-400 mt-1">🎯</span>
                <span className="text-gray-300">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Practice More
          </button>
          <button
            onClick={generateAnalysis}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Refresh Analysis
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIAnalysis
