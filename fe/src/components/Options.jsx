import { useEffect, useState, memo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setLanguage, setTheme } from "../store/slices/settingsSlice"
import { Globe, Palette, Keyboard } from 'lucide-react'

// Memoize the Options component to prevent unnecessary re-renders
const Options = memo(function Options() {
  const [languages, setLanguages] = useState([])
  const dispatch = useDispatch()
  const currentLanguage = useSelector((state) => state.settings.language)
  const currentTheme = useSelector((state) => state.settings.theme)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      dispatch(setTheme(savedTheme))
    } else {
      localStorage.setItem("theme", "dark")
      dispatch(setTheme("dark"))
    }
  }, [dispatch])

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const response = await fetch(`https://api.allorigins.win/raw?url=https://monkeytype.com/languages/_list.json`)
        const data = await response.json()
        if (data) {
          setLanguages(data)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchLanguages()
  }, [])

  const handleThemeChange = (e) => {
    const newTheme = e.target.value
    localStorage.setItem("theme", newTheme)
    dispatch(setTheme(newTheme))
  }

  return (
    <div
      className={`rounded-xl shadow-xl backdrop-blur-sm border transition-colors ${
        currentTheme === "dark" ? "bg-gray-800/50 border-gray-700/50" : "bg-white/70 border-gray-200/50"
      }`}
      style={{ height: "fit-content" }}
    >
      <div className="p-6">
        <h2
          className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
            currentTheme === "dark" ? "text-emerald-400" : "text-emerald-600"
          }`}
        >
          <Palette className="w-6 h-6" />
          Settings
        </h2>

        <div className="space-y-6">
          <div className="language-selector">
            <label
              htmlFor="language"
              className={`flex items-center gap-2 mb-3 font-medium ${
                currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <Globe className="w-4 h-4" />
              Language
            </label>
            <select
              name="language"
              id="language"
              value={currentLanguage}
              onChange={(e) => dispatch(setLanguage(e.target.value))}
              className={`w-full rounded-lg py-3 px-4 border-2 focus:outline-none focus:ring-4 transition-colors font-medium
                ${
                  currentTheme === "dark"
                    ? "bg-gray-700/50 text-gray-300 border-gray-600 focus:border-emerald-400 focus:ring-emerald-400/20"
                    : "bg-white/70 text-gray-900 border-gray-300 focus:border-emerald-600 focus:ring-emerald-600/20"
                }`}
            >
              {languages.map((lang, index) => (
                <option key={index} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="theme-selector">
            <label
              htmlFor="theme"
              className={`flex items-center gap-2 mb-3 font-medium ${
                currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <Palette className="w-4 h-4" />
              Theme
            </label>
            <select
              name="theme"
              id="theme"
              value={currentTheme}
              onChange={handleThemeChange}
              className={`w-full rounded-lg py-3 px-4 border-2 focus:outline-none focus:ring-4 transition-colors font-medium
                ${
                  currentTheme === "dark"
                    ? "bg-gray-700/50 text-gray-300 border-gray-600 focus:border-emerald-400 focus:ring-emerald-400/20"
                    : "bg-white/70 text-gray-900 border-gray-300 focus:border-emerald-600 focus:ring-emerald-600/20"
                }`}
            >
              <option value="dark">🌙 Dark Mode</option>
              <option value="light">☀️ Light Mode</option>
            </select>
          </div>

          <div
            className={`p-4 rounded-lg border ${
              currentTheme === "dark"
                ? "bg-gray-700/30 border-gray-600/50 text-gray-400"
                : "bg-gray-50/50 border-gray-200/50 text-gray-600"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Keyboard className="w-4 h-4" />
              <span className="font-medium">Shortcuts</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>New words</span>
                <kbd
                  className={`px-2 py-1 rounded font-mono text-xs ${
                    currentTheme === "dark"
                      ? "bg-gray-600 text-gray-300 border border-gray-500"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  ESC
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Options