import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from 'react'
import { User, Zap, Target, Trophy, Calendar, TrendingUp, BarChart, Activity, Clock, Hash } from 'lucide-react'
import { fetchUserStats } from '../store/slices/userStatsSlice'

function Profile() {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.settings.theme)
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { userStats, isLoadingStats } = useSelector((state) => state.userStats)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserStats())
    }
  }, [dispatch, isAuthenticated])

  // Format time helper
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  // Simple chart component
  const SimpleChart = ({ data, type = 'wpm' }) => {
    const maxValue = Math.max(...data.map(d => d[type]))
    const chartColor = type === 'wpm' ? 'bg-blue-400' : 'bg-green-400'
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Last {data.length} tests</span>
          <span>Max: {maxValue}</span>
        </div>
        <div className="flex items-end gap-1 h-20">
          {data.map((point, i) => {
            const height = (point[type] / maxValue) * 100
            return (
              <div 
                key={i} 
                className={`${chartColor} rounded-t transition-all duration-300 hover:opacity-80 flex-1`}
                style={{ height: `${height}%` }}
                title={`${point[type]} ${type.toUpperCase()}`}
              />
            )
          })}
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-xl shadow-xl backdrop-blur-sm border text-center p-12 ${
          theme === "dark" ? "bg-gray-800/50 border-gray-700/50" : "bg-white/70 border-gray-200/50"
        }`}>
          <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Sign in to view your profile
          </h2>
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Track your typing progress, view detailed statistics, and compete with others!
          </p>
        </div>
      </div>
    )
  }

  if (isLoadingStats) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-xl shadow-xl backdrop-blur-sm border text-center p-12 ${
          theme === "dark" ? "bg-gray-800/50 border-gray-700/50" : "bg-white/70 border-gray-200/50"
        }`}>
          <div className="animate-spin rounded-full h-12 w-12 mx-auto mb-4 border-b-2 border-emerald-500"></div>
          <div className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Loading your stats...
          </div>
        </div>
      </div>
    )
  }

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div
      className={`p-6 rounded-xl border transition-all duration-300 ${
        theme === "dark"
          ? "bg-gray-700/50 border-gray-600/50 hover:bg-gray-700/70"
          : "bg-white/70 border-gray-200/50 hover:bg-white/90"
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{label}</span>
      </div>
      <div className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{value}</div>
    </div>
  )

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'history', label: 'History', icon: Clock },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className={`rounded-xl shadow-xl backdrop-blur-sm border ${
        theme === "dark" ? "bg-gray-800/50 border-gray-700/50" : "bg-white/70 border-gray-200/50"
      }`}>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                theme === "dark"
                  ? "bg-gradient-to-br from-emerald-400 to-blue-500"
                  : "bg-gradient-to-br from-emerald-500 to-blue-600"
              }`}>
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {user?.username || 'Anonymous User'}
                </h1>
                <p className={`flex items-center gap-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  <Trophy className="w-4 h-4" />
                  {userStats.testsCompleted} tests completed
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                  {userStats.bestWpm || 0}
                </div>
                <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Best WPM</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>
                  {userStats.bestAccuracy || 0}%
                </div>
                <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Best Acc</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}>
                  {userStats.avgWpm || 0}
                </div>
                <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Avg WPM</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? theme === "dark"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30"
                      : theme === "dark"
                        ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                        : "text-gray-600 hover:text-gray-700 hover:bg-gray-100/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Trophy}
            label="Tests Completed"
            value={userStats.testsCompleted || 0}
            color={theme === "dark" ? "text-yellow-400" : "text-yellow-600"}
          />
          <StatCard
            icon={Zap}
            label="Average WPM"
            value={userStats.avgWpm || 0}
            color={theme === "dark" ? "text-blue-400" : "text-blue-600"}
          />
          <StatCard
            icon={Target}
            label="Average Accuracy"
            value={`${userStats.avgAccuracy || 0}%`}
            color={theme === "dark" ? "text-emerald-400" : "text-emerald-600"}
          />
          <StatCard
            icon={Clock}
            label="Total Time"
            value={formatTime(userStats.totalTimeTyping || 0)}
            color={theme === "dark" ? "text-purple-400" : "text-purple-600"}
          />
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* WPM Chart */}
          <div className={`rounded-xl shadow-xl backdrop-blur-sm border p-6 ${
            theme === "dark" ? "bg-gray-800/50 border-gray-700/50" : "bg-white/70 border-gray-200/50"
          }`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}>
              <Zap className="w-5 h-5" />
              WPM Progress
            </h3>
            {userStats.recentResults?.length > 0 ? (
              <SimpleChart data={userStats.recentResults} type="wpm" />
            ) : (
              <div className={`text-center py-8 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                No test data available yet
              </div>
            )}
          </div>

          {/* Accuracy Chart */}
          <div className={`rounded-xl shadow-xl backdrop-blur-sm border p-6 ${
            theme === "dark" ? "bg-gray-800/50 border-gray-700/50" : "bg-white/70 border-gray-200/50"
          }`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
              theme === "dark" ? "text-emerald-400" : "text-emerald-600"
            }`}>
              <Target className="w-5 h-5" />
              Accuracy Progress
            </h3>
            {userStats.recentResults?.length > 0 ? (
              <SimpleChart data={userStats.recentResults} type="accuracy" />
            ) : (
              <div className={`text-center py-8 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                No test data available yet
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className={`rounded-xl shadow-xl backdrop-blur-sm border ${
          theme === "dark" ? "bg-gray-800/50 border-gray-700/50" : "bg-white/70 border-gray-200/50"
        }`}>
          <div className="p-6">
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
              theme === "dark" ? "text-emerald-400" : "text-emerald-600"
            }`}>
              <Activity className="w-5 h-5" />
              Recent Tests
            </h3>
            {userStats.recentResults?.length > 0 ? (
              <div className="space-y-3">
                {userStats.recentResults.map((test, index) => (
                  <div
                    key={test.id || index}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50"
                        : "bg-gray-50/50 border-gray-200/50 hover:bg-gray-100/50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {new Date(test.timestamp).toLocaleDateString()}
                        </div>
                        <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          {test.timeSeconds}s test
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                          {test.wpm} WPM
                        </div>
                        <div className={`text-sm ${
                          test.accuracy >= 95
                            ? theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                            : theme === "dark" ? "text-yellow-400" : "text-yellow-600"
                        }`}>
                          {test.accuracy}% ACC
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No typing tests completed yet.</p>
                <p className="text-sm mt-2">Start typing to build your history!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile