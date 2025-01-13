import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLeaderboard } from '../store/slices/userStatsSlice'
import { 
  Trophy, 
  Crown, 
  Medal, 
  TrendingUp, 
  Filter, 
  Clock,
  Target,
  Zap,
  Hash,
  Calendar,
  Users,
  Star,
  Award
} from 'lucide-react'

const Leaderboard = () => {
  const dispatch = useDispatch()
  const { leaderboard, isLoadingLeaderboard } = useSelector(state => state.userStats)
  const { theme } = useSelector(state => state.settings)
  
  const [activeFilter, setActiveFilter] = useState('overall')
  const [timeFilter, setTimeFilter] = useState('all')
  const [displayedUsers, setDisplayedUsers] = useState(50)

  useEffect(() => {
    dispatch(fetchLeaderboard())
  }, [dispatch])

  const filters = [
    { id: 'overall', label: 'Overall', icon: Trophy },
    { id: 'speed', label: 'Speed (WPM)', icon: Zap },
    { id: 'accuracy', label: 'Accuracy', icon: Target },
    { id: 'consistency', label: 'Consistency', icon: TrendingUp },
  ]

  const timeFilters = [
    { id: 'all', label: 'All Time' },
    { id: 'month', label: 'This Month' },
    { id: 'week', label: 'This Week' },
    { id: 'today', label: 'Today' },
  ]

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>
  }

  const getRankBadge = (rank) => {
    if (rank <= 3) {
      const colors = {
        1: 'from-yellow-400 to-yellow-600',
        2: 'from-gray-300 to-gray-500', 
        3: 'from-amber-500 to-amber-700'
      }
      return `bg-gradient-to-r ${colors[rank]} text-white`
    }
    return theme === 'dark' 
      ? 'bg-gray-700/50 text-gray-300' 
      : 'bg-gray-100 text-gray-700'
  }

  const getStatColor = (value, type) => {
    if (type === 'wpm') {
      if (value >= 80) return 'text-emerald-400'
      if (value >= 60) return 'text-blue-400'
      if (value >= 40) return 'text-yellow-400'
      return 'text-gray-400'
    }
    if (type === 'accuracy') {
      if (value >= 98) return 'text-emerald-400'
      if (value >= 95) return 'text-blue-400'
      if (value >= 90) return 'text-yellow-400'
      return 'text-gray-400'
    }
    return 'text-gray-400'
  }

  if (isLoadingLeaderboard) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className={`rounded-xl shadow-xl backdrop-blur-sm border ${
          theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/70 border-gray-200/50'
        }`}>
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 mx-auto mb-4 border-b-2 border-emerald-500"></div>
            <div className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Loading leaderboard...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className={`rounded-xl shadow-xl backdrop-blur-sm border ${
        theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/70 border-gray-200/50'
      }`}>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className={`text-3xl font-bold flex items-center gap-3 ${
              theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
            }`}>
              <Trophy className="w-8 h-8" />
              Leaderboard
            </h1>
            
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {leaderboard.length} competitors
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => {
                const Icon = filter.icon
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeFilter === filter.id
                        ? theme === 'dark'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30'
                        : theme === 'dark'
                          ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                          : 'bg-gray-100/50 text-gray-600 hover:bg-gray-200 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {filter.label}
                  </button>
                )
              })}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {timeFilters.map(timeFilter => (
                <button
                  key={timeFilter.id}
                  onClick={() => setTimeFilter(timeFilter.id)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    timeFilter === timeFilter.id
                      ? theme === 'dark'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-blue-500/20 text-blue-600'
                      : theme === 'dark'
                        ? 'text-gray-500 hover:text-gray-300'
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {timeFilter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className={`rounded-xl shadow-xl backdrop-blur-sm border ${
        theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/70 border-gray-200/50'
      }`}>
        <div className="p-6">
          <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <Crown className="w-5 h-5 text-yellow-400" />
            Top Performers
          </h2>
          
          {leaderboard.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 0, 2].map((index, position) => {
                const user = leaderboard[index]
                if (!user) return null
                
                const heights = ['h-20', 'h-24', 'h-16'] // 2nd, 1st, 3rd
                const orders = ['md:order-1', 'md:order-0', 'md:order-2']
                
                return (
                  <div key={user.rank} className={`text-center ${orders[position]}`}>
                    <div className={`${heights[position]} w-full rounded-lg mb-4 ${getRankBadge(user.rank)} 
                      flex items-end justify-center pb-2 relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div className="relative">
                        {getRankIcon(user.rank)}
                      </div>
                    </div>
                    <div className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {user.username}
                    </div>
                    <div className={`text-2xl font-bold ${getStatColor(user.wpm, 'wpm')}`}>
                      {user.wpm} WPM
                    </div>
                    <div className={`text-sm ${getStatColor(user.accuracy, 'accuracy')}`}>
                      {user.accuracy}% ACC
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className={`rounded-xl shadow-xl backdrop-blur-sm border ${
        theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/70 border-gray-200/50'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold flex items-center gap-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <Hash className="w-5 h-5" />
              Full Rankings
            </h2>
            
            <div className="flex items-center gap-2">
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Showing top {displayedUsers}
              </span>
              <select 
                value={displayedUsers}
                onChange={(e) => setDisplayedUsers(Number(e.target.value))}
                className={`px-3 py-1 rounded-md text-sm ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300 border-gray-600' 
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <th className={`text-left py-3 px-4 font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Rank</th>
                  <th className={`text-left py-3 px-4 font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>User</th>
                  <th className={`text-right py-3 px-4 font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>WPM</th>
                  <th className={`text-right py-3 px-4 font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Accuracy</th>
                  <th className={`text-right py-3 px-4 font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Tests</th>
                  <th className={`text-right py-3 px-4 font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Avg WPM</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.slice(0, displayedUsers).map((user, index) => (
                  <tr 
                    key={user.username}
                    className={`border-b transition-colors ${
                      theme === 'dark' 
                        ? 'border-gray-700/50 hover:bg-gray-700/30' 
                        : 'border-gray-200/50 hover:bg-gray-50/50'
                    } ${user.isCurrentUser ? 'bg-emerald-500/10' : ''}`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(user.rank)}
                        {user.isCurrentUser && (
                          <Star className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className={`font-medium ${
                        user.isCurrentUser 
                          ? 'text-emerald-400'
                          : theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {user.username}
                        {user.isCurrentUser && (
                          <span className="ml-2 text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={`py-4 px-4 text-right font-bold ${getStatColor(user.wpm, 'wpm')}`}>
                      {user.wpm}
                    </td>
                    <td className={`py-4 px-4 text-right ${getStatColor(user.accuracy, 'accuracy')}`}>
                      {user.accuracy}%
                    </td>
                    <td className={`py-4 px-4 text-right ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {user.testsCompleted.toLocaleString()}
                    </td>
                    <td className={`py-4 px-4 text-right ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {user.avgWpm}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {leaderboard.length > displayedUsers && (
            <div className="mt-6 text-center">
              <button 
                onClick={() => setDisplayedUsers(prev => Math.min(prev + 50, leaderboard.length))}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: leaderboard.length.toLocaleString(), icon: Users, color: 'text-blue-400' },
          { label: 'Avg WPM', value: Math.round(leaderboard.reduce((sum, u) => sum + u.avgWpm, 0) / leaderboard.length), icon: Zap, color: 'text-emerald-400' },
          { label: 'Avg Accuracy', value: `${Math.round(leaderboard.reduce((sum, u) => sum + u.accuracy, 0) / leaderboard.length)}%`, icon: Target, color: 'text-yellow-400' },
          { label: 'Total Tests', value: leaderboard.reduce((sum, u) => sum + u.testsCompleted, 0).toLocaleString(), icon: Hash, color: 'text-purple-400' },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className={`rounded-xl shadow-lg backdrop-blur-sm border p-6 text-center ${
              theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/70 border-gray-200/50'
            }`}>
              <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Leaderboard
