import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserStats, getTestHistory, exportUserData, clearAllData } from '../utils/localStorage'
import { User, Trophy, Clock, Target, TrendingUp, Calendar, Download, Trash2, Brain } from 'lucide-react'

function Profile() {
  const navigate = useNavigate()
  const [userStats, setUserStats] = useState(null)
  const [testHistory, setTestHistory] = useState([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = () => {
    const stats = getUserStats()
    const history = getTestHistory()
    setUserStats(stats)
    setTestHistory(history)
  }

  const handleExportData = () => {
    const data = exportUserData()
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `junkytype-data-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
      clearAllData()
      loadUserData()
    }
  }

  const handleAIAnalysis = () => {
    if (userStats && userStats.totalTests > 0) {
      navigate('/ai-analysis', { 
        state: { 
          testResult: {
            wpm: userStats.averageWPM,
            accuracy: userStats.averageAccuracy,
            errors: userStats.totalErrors,
            time: Math.round(userStats.totalTimeTyping / userStats.totalTests),
            testType: 'average'
          }
        }
      })
    }
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (!userStats) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">No Profile Data</h2>
            <p className="text-gray-400">Complete some typing tests to see your profile statistics.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
            <p className="text-gray-400">Track your typing progress and performance</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAIAnalysis}
              disabled={!userStats || userStats.totalTests === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                userStats && userStats.totalTests > 0
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Brain className="w-4 h-4" />
              AI Analysis
            </button>
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <button
              onClick={handleClearData}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Data
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'history', label: 'Test History', icon: Calendar },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Trophy className="w-8 h-8 text-blue-200" />
                  <span className="text-blue-200 text-sm">Best</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{userStats.bestWPM}</div>
                <div className="text-blue-200 text-sm">WPM</div>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Target className="w-8 h-8 text-green-200" />
                  <span className="text-green-200 text-sm">Average</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{userStats.averageWPM}</div>
                <div className="text-green-200 text-sm">WPM</div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Target className="w-8 h-8 text-purple-200" />
                  <span className="text-purple-200 text-sm">Accuracy</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{userStats.bestAccuracy}%</div>
                <div className="text-purple-200 text-sm">Best</div>
              </div>

              <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8 text-orange-200" />
                  <span className="text-orange-200 text-sm">Total</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{userStats.totalTests}</div>
                <div className="text-orange-200 text-sm">Tests</div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6">Detailed Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-bold text-blue-400">{formatTime(userStats.totalTimeTyping)}</div>
                  <div className="text-gray-400 text-sm">Total Time Typing</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">{userStats.totalCharactersTyped.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">Characters Typed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">{userStats.totalWordsTyped.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">Words Typed</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Recent Test History</h3>
            {testHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-4" />
                <p>No test history available</p>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">WPM</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Accuracy</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Errors</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {testHistory.slice(0, 20).map((test, index) => (
                        <tr key={test.id || index} className="hover:bg-gray-700">
                          <td className="px-6 py-4 text-sm text-gray-300">{formatDate(test.timestamp)}</td>
                          <td className="px-6 py-4 text-sm font-medium text-blue-400">{test.wpm || 0}</td>
                          <td className="px-6 py-4 text-sm font-medium text-green-400">{test.accuracy || 0}%</td>
                          <td className="px-6 py-4 text-sm font-medium text-red-400">{test.errors || 0}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{test.time || 0}s</td>
                          <td className="px-6 py-4 text-sm text-gray-300 capitalize">{test.testType || 'words'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Performance Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-4">Average Performance</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Average WPM</span>
                      <span className="font-medium">{userStats.averageWPM}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(userStats.averageWPM, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Average Accuracy</span>
                      <span className="font-medium">{userStats.averageAccuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${userStats.averageAccuracy}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-4">Progress Insights</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>You've completed {userStats.totalTests} typing tests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Your best speed is {userStats.bestWPM} WPM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Total typing time: {formatTime(userStats.totalTimeTyping)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Error rate: {userStats.totalTests > 0 ? Math.round((userStats.totalErrors / userStats.totalCharactersTyped) * 100) : 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
