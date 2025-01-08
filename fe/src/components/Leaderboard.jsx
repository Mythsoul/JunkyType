import { useSelector } from "react-redux"
import { Trophy, Medal, Award, Crown } from 'lucide-react'

function Leaderboard() {
  const theme = useSelector((state) => state.settings.theme)

  // Sample data - replace with actual data
  const leaderboardData = [
    { rank: 1, username: "SpeedMaster", wpm: 120, accuracy: 98 },
    { rank: 2, username: "TypeNinja", wpm: 115, accuracy: 97 },
    { rank: 3, username: "KeyboardKing", wpm: 110, accuracy: 96 },
    { rank: 4, username: "FastFingers", wpm: 105, accuracy: 95 },
    { rank: 5, username: "QuickType", wpm: 100, accuracy: 94 },
    { rank: 6, username: "RapidRacer", wpm: 95, accuracy: 93 },
    { rank: 7, username: "SwiftTyper", wpm: 90, accuracy: 92 },
    { rank: 8, username: "FlashKeys", wpm: 85, accuracy: 91 },
  ]

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <Trophy className="w-5 h-5 text-gray-500" />
    }
  }

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return theme === "dark"
          ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30"
          : "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30"
      case 2:
        return theme === "dark"
          ? "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30"
          : "bg-gradient-to-r from-gray-400/10 to-gray-500/10 border-gray-400/30"
      case 3:
        return theme === "dark"
          ? "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30"
          : "bg-gradient-to-r from-amber-600/10 to-orange-600/10 border-amber-600/30"
      default:
        return theme === "dark"
          ? "bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50"
          : "bg-white/70 border-gray-200/50 hover:bg-gray-50/70"
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2
          className={`text-4xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent ${
            theme === "dark" ? "from-emerald-400 to-blue-400" : "from-emerald-600 to-blue-600"
          }`}
        >
          🏆 Leaderboard
        </h2>
        <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Top performers this week</p>
      </div>

      <div
        className={`rounded-xl shadow-2xl backdrop-blur-sm border overflow-hidden ${
          theme === "dark" ? "bg-gray-800/50 border-gray-700/50" : "bg-white/70 border-gray-200/50"
        }`}
      >
        <div
          className={`px-6 py-4 border-b ${
            theme === "dark" ? "bg-gray-700/50 border-gray-600/50" : "bg-gray-50/50 border-gray-200/50"
          }`}
        >
          <div className="grid grid-cols-12 gap-4 font-semibold text-sm uppercase tracking-wide">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-5">Player</div>
            <div className="col-span-3 text-center">Speed</div>
            <div className="col-span-3 text-center">Accuracy</div>
          </div>
        </div>

        <div className="divide-y divide-gray-700/50">
          {leaderboardData.map((player) => (
            <div
              key={player.rank}
              className={`px-6 py-4 transition-all duration-300 border ${getRankStyle(player.rank)}`}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1 flex justify-center">
                  <div className="flex items-center gap-2">
                    {getRankIcon(player.rank)}
                    <span className="font-bold text-lg">{player.rank}</span>
                  </div>
                </div>

                <div className="col-span-5">
                  <div className={`font-semibold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {player.username}
                  </div>
                </div>

                <div className="col-span-3 text-center">
                  <div className={`text-2xl font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                    {player.wpm}
                  </div>
                  <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>WPM</div>
                </div>

                <div className="col-span-3 text-center">
                  <div
                    className={`text-2xl font-bold ${
                      player.accuracy >= 95
                        ? theme === "dark"
                          ? "text-emerald-400"
                          : "text-emerald-600"
                        : player.accuracy >= 90
                          ? theme === "dark"
                            ? "text-yellow-400"
                            : "text-yellow-600"
                          : theme === "dark"
                            ? "text-red-400"
                            : "text-red-600"
                    }`}
                  >
                    {player.accuracy}%
                  </div>
                  <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>ACC</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`mt-6 text-center text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        Rankings update every hour • Keep practicing to climb the leaderboard!
      </div>
    </div>
  )
}

export default Leaderboard