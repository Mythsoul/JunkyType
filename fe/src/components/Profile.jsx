import { useSelector } from "react-redux"
import { User, Zap, Target, Trophy, Calendar, TrendingUp } from 'lucide-react'

function Profile() {
  const theme = useSelector((state) => state.settings.theme)

  // Sample data - replace with actual user data
  const userStats = {
    username: "User123",
    joinDate: "March 2024",
    testsCompleted: 42,
    averageWpm: 75,
    bestWpm: 90,
    averageAccuracy: 94,
    bestAccuracy: 98,
    totalTimeTyping: "2h 15m",
    favoriteLanguage: "English",
  }

  const recentTests = [
    { date: "Today", wpm: 78, accuracy: 96, language: "English" },
    { date: "Yesterday", wpm: 82, accuracy: 94, language: "English" },
    { date: "2 days ago", wpm: 75, accuracy: 95, language: "Spanish" },
    { date: "3 days ago", wpm: 73, accuracy: 93, language: "English" },
  ]

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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div
        className={`rounded-xl shadow-2xl backdrop-blur-sm border ${
          theme === "dark" ? "bg-gray-800/50 border-gray-700/50" : "bg-white/70 border-gray-200/50"
        }`}
      >
        <div className="p-8">
          <div className="flex items-center gap-6 mb-6">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center ${
                theme === "dark"
                  ? "bg-gradient-to-br from-emerald-400 to-blue-500"
                  : "bg-gradient-to-br from-emerald-500 to-blue-600"
              }`}
            >
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {userStats.username}
              </h1>
              <p className={`flex items-center gap-2 mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                <Calendar className="w-4 h-4" />
                Member since {userStats.joinDate}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={Trophy}
              label="Tests Completed"
              value={userStats.testsCompleted}
              color={theme === "dark" ? "text-yellow-400" : "text-yellow-600"}
            />
            <StatCard
              icon={Zap}
              label="Best WPM"
              value={userStats.bestWpm}
              color={theme === "dark" ? "text-blue-400" : "text-blue-600"}
            />
            <StatCard
              icon={Target}
              label="Best Accuracy"
              value={`${userStats.bestAccuracy}%`}
              color={theme === "dark" ? "text-emerald-400" : "text-emerald-600"}
            />
            <StatCard
              icon={TrendingUp}
              label="Avg WPM"
              value={userStats.averageWpm}
              color={theme === "dark" ? "text-purple-400" : "text-purple-600"}
            />
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Performance Overview */}
        <div
          className={`rounded-xl shadow-xl backdrop-blur-sm border ${
            theme === "dark" ? "bg-gray-800/50 border-gray-700/50" : "bg-white/70 border-gray-200/50"
          }`}
        >
          <div className="p-6">
            <h3 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>
              Performance Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Average WPM:</span>
                <span className={`font-bold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {userStats.averageWpm}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Average Accuracy:</span>
                <span className={`font-bold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {userStats.averageAccuracy}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Total Time Typing:</span>
                <span className={`font-bold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {userStats.totalTimeTyping}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Favorite Language:</span>
                <span className={`font-bold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {userStats.favoriteLanguage}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tests */}
        <div
          className={`rounded-xl shadow-xl backdrop-blur-sm border ${
            theme === "dark" ? "bg-gray-800/50 border-gray-700/50" : "bg-white/70 border-gray-200/50"
          }`}
        >
          <div className="p-6">
            <h3 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>
              Recent Tests
            </h3>
            <div className="space-y-3">
              {recentTests.map((test, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50"
                      : "bg-gray-50/50 border-gray-200/50 hover:bg-gray-100/50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {test.date}
                      </div>
                      <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        {test.language}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                        {test.wpm} WPM
                      </div>
                      <div
                        className={`text-sm ${
                          test.accuracy >= 95
                            ? theme === "dark"
                              ? "text-emerald-400"
                              : "text-emerald-600"
                            : theme === "dark"
                              ? "text-yellow-400"
                              : "text-yellow-600"
                        }`}
                      >
                        {test.accuracy}% ACC
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile