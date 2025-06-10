import { useSelector } from "react-redux"
import { Zap, Target, AlertCircle, Timer } from 'lucide-react'
import { memo } from "react"

// Memoize the Info component to prevent unnecessary re-renders
const Info = memo(function Info({ wpm, accuracy, errors, isStarted }) {
  const theme = useSelector((state) => state.settings.theme)

  const getAccuracyColor = (acc) => {
    if (acc >= 95) return theme === "dark" ? "text-emerald-400 bg-emerald-500/20" : "text-emerald-600 bg-emerald-500/10"
    if (acc >= 90) return theme === "dark" ? "text-yellow-400 bg-yellow-500/20" : "text-yellow-600 bg-yellow-500/10"
    return theme === "dark" ? "text-red-400 bg-red-500/20" : "text-red-600 bg-red-500/10"
  }

  const stats = [
    {
      icon: Zap,
      label: "Speed",
      value: wpm,
      unit: "WPM",
      color: theme === "dark" ? "text-blue-400 bg-blue-500/20" : "text-blue-600 bg-blue-500/10",
    },
    {
      icon: Target,
      label: "Accuracy",
      value: accuracy,
      unit: "%",
      color: getAccuracyColor(accuracy),
    },
    {
      icon: AlertCircle,
      label: "Errors",
      value: errors,
      unit: "",
      color: theme === "dark" ? "text-red-400 bg-red-500/20" : "text-red-600 bg-red-500/10",
    },
  ]

  return (
    <div
      className={`rounded-xl shadow-xl backdrop-blur-sm border transition-colors ${
        theme === "dark" ? "bg-gray-800/50 border-gray-700/50" : "bg-white/70 border-gray-200/50"
      }`}
      style={{ height: "fit-content" }}
    >
      <div className="p-6">
        <h2
          className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
            theme === "dark" ? "text-emerald-400" : "text-emerald-600"
          }`}
        >
          <Timer className="w-6 h-6" />
          Live Stats
        </h2>

        <div className="space-y-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-colors ${
                  isStarted
                    ? `${stat.color} border-current/20 shadow-lg`
                    : theme === "dark"
                      ? "bg-gray-700/30 border-gray-600/50 text-gray-500"
                      : "bg-gray-50/50 border-gray-200/50 text-gray-400"
                }`}
                style={{ minHeight: "80px" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{stat.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {stat.value}
                      <span className="text-sm font-normal ml-1">{stat.unit}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {!isStarted && (
          <div
            className={`mt-6 p-4 rounded-lg border ${
              theme === "dark"
                ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                : "bg-blue-500/5 border-blue-500/20 text-blue-600"
            }`}
          >
            <div className="text-center">
              <div className="text-sm font-medium mb-1">Ready to start?</div>
              <div className="text-xs opacity-75">Click the text area and begin typing</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

export default Info