import { useEffect, useState, memo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { 
  setLanguage, 
  setTheme, 
  setWordCount,
  setTimeLimit,
  setIncludeNumbers,
  setIncludePunctuation,
  setIncludeSymbols,
  setDifficulty,
  setCustomWords,
  setSmoothCaret,
  setSoundEffects,
  setFontSize,
  setFontFamily,
  setCursorStyle,
  setShowLiveWPM,
  setShowLiveAccuracy,
  setBlindMode,
  setHighlightErrors,
  setShowKeyboard,
  setColorTheme
} from "../store/slices/settingsSlice"
import { 
  Globe, 
  Palette, 
  Keyboard, 
  Clock, 
  Settings, 
  Volume2, 
  Eye, 
  Type,
  Zap,
  Hash,
  MoreHorizontal,
  Target
} from 'lucide-react'

// Memoize the Options component to prevent unnecessary re-renders
const Options = memo(function Options() {
  const [languages, setLanguages] = useState([])
  const [activeTab, setActiveTab] = useState('general')
  const dispatch = useDispatch()
  const settings = useSelector((state) => state.settings)

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

  const SelectField = ({ label, icon: Icon, value, onChange, options }) => (
    <div>
      <label className={`flex items-center gap-2 mb-3 font-medium ${
        settings.theme === "dark" ? "text-gray-300" : "text-gray-700"
      }`}>
        <Icon className="w-4 h-4" />
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg py-3 px-4 border-2 focus:outline-none focus:ring-4 transition-colors font-medium ${
          settings.theme === "dark"
            ? "bg-gray-700/50 text-gray-300 border-gray-600 focus:border-emerald-400 focus:ring-emerald-400/20"
            : "bg-white/70 text-gray-900 border-gray-300 focus:border-emerald-600 focus:ring-emerald-600/20"
        }`}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )

  const ToggleField = ({ label, icon: Icon, value, onChange, description }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <div>
          <div className={`font-medium ${
            settings.theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}>
            {label}
          </div>
          {description && (
            <div className={`text-sm ${
              settings.theme === "dark" ? "text-gray-500" : "text-gray-500"
            }`}>
              {description}
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value 
            ? "bg-emerald-500" 
            : settings.theme === "dark" 
              ? "bg-gray-600" 
              : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )

  const NumberField = ({ label, icon: Icon, value, onChange, min, max, step = 1 }) => (
    <div>
      <label className={`flex items-center gap-2 mb-3 font-medium ${
        settings.theme === "dark" ? "text-gray-300" : "text-gray-700"
      }`}>
        <Icon className="w-4 h-4" />
        {label}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
          settings.theme === "dark" ? "bg-gray-700" : "bg-gray-200"
        }`}
      />
      <div className={`text-center mt-2 font-mono ${
        settings.theme === "dark" ? "text-emerald-400" : "text-emerald-600"
      }`}>
        {value}{label.includes('Font') ? 'px' : ''}
      </div>
    </div>
  )

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'test', label: 'Test Options', icon: Target },
    { id: 'typing', label: 'Typing', icon: Type },
    { id: 'appearance', label: 'Appearance', icon: Eye },
  ]

  return (
    <div className={`rounded-xl shadow-xl backdrop-blur-sm border transition-colors ${
      settings.theme === "dark" ? "bg-gray-800/50 border-gray-700/50" : "bg-white/70 border-gray-200/50"
    }`}>
      <div className="p-6">
        <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
          settings.theme === "dark" ? "text-emerald-400" : "text-emerald-600"
        }`}>
          <Settings className="w-6 h-6" />
          Settings
        </h2>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? settings.theme === "dark"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30"
                    : settings.theme === "dark"
                      ? "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                      : "bg-gray-100/50 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'general' && (
            <>
              <SelectField
                label="Language"
                icon={Globe}
                value={settings.language}
                onChange={(e) => dispatch(setLanguage(e.target.value))}
                options={languages.map(lang => ({
                  value: lang,
                  label: lang.charAt(0).toUpperCase() + lang.slice(1)
                }))}
              />
              <SelectField
                label="Theme"
                icon={Palette}
                value={settings.theme}
                onChange={handleThemeChange}
                options={[
                  { value: "dark", label: "🌙 Dark Mode" },
                  { value: "light", label: "☀️ Light Mode" }
                ]}
              />
              <ToggleField
                label="Sound Effects"
                icon={Volume2}
                value={settings.soundEffects}
                onChange={(value) => dispatch(setSoundEffects(value))}
                description="Play sounds for keystrokes and completion"
              />
            </>
          )}

          {activeTab === 'test' && (
            <>
              <SelectField
                label="Test Mode"
                icon={Clock}
                value={settings.timeLimit ? 'time' : 'words'}
                onChange={(e) => {
                  if (e.target.value === 'time') {
                    dispatch(setTimeLimit(60))
                  } else {
                    dispatch(setTimeLimit(null))
                  }
                }}
                options={[
                  { value: "words", label: "Word Count" },
                  { value: "time", label: "Time Limit" }
                ]}
              />
              
              {settings.timeLimit ? (
                <SelectField
                  label="Time Limit"
                  icon={Clock}
                  value={settings.timeLimit}
                  onChange={(e) => dispatch(setTimeLimit(Number(e.target.value)))}
                  options={settings.timeLimits.map(time => ({
                    value: time,
                    label: `${time} seconds`
                  }))}
                />
              ) : (
                <SelectField
                  label="Word Count"
                  icon={Hash}
                  value={settings.wordCount}
                  onChange={(e) => dispatch(setWordCount(Number(e.target.value)))}
                  options={settings.wordCounts.map(count => ({
                    value: count,
                    label: `${count} words`
                  }))}
                />
              )}
              
              <SelectField
                label="Difficulty"
                icon={Zap}
                value={settings.difficulty}
                onChange={(e) => dispatch(setDifficulty(e.target.value))}
                options={[
                  { value: "easy", label: "Easy - Common words" },
                  { value: "normal", label: "Normal - Mixed words" },
                  { value: "hard", label: "Hard - Complex words" }
                ]}
              />
              
              <ToggleField
                label="Include Numbers"
                icon={Hash}
                value={settings.includeNumbers}
                onChange={(value) => dispatch(setIncludeNumbers(value))}
                description="Add numbers to the test"
              />
              
              <ToggleField
                label="Include Punctuation"
                icon={MoreHorizontal}
                value={settings.includePunctuation}
                onChange={(value) => dispatch(setIncludePunctuation(value))}
                description="Add punctuation marks"
              />
            </>
          )}

          {activeTab === 'typing' && (
            <>
              <ToggleField
                label="Smooth Caret"
                icon={Type}
                value={settings.smoothCaret}
                onChange={(value) => dispatch(setSmoothCaret(value))}
                description="Animate cursor movement"
              />
              
              <ToggleField
                label="Show Live WPM"
                icon={Zap}
                value={settings.showLiveWPM}
                onChange={(value) => dispatch(setShowLiveWPM(value))}
                description="Display WPM during typing"
              />
              
              <ToggleField
                label="Show Live Accuracy"
                icon={Target}
                value={settings.showLiveAccuracy}
                onChange={(value) => dispatch(setShowLiveAccuracy(value))}
                description="Display accuracy during typing"
              />
              
              <ToggleField
                label="Blind Mode"
                icon={Eye}
                value={settings.blindMode}
                onChange={(value) => dispatch(setBlindMode(value))}
                description="Hide text after typing"
              />
              
              <ToggleField
                label="Highlight Errors"
                icon={Target}
                value={settings.highlightErrors}
                onChange={(value) => dispatch(setHighlightErrors(value))}
                description="Show typing mistakes clearly"
              />
            </>
          )}

          {activeTab === 'appearance' && (
            <>
              <NumberField
                label="Font Size"
                icon={Type}
                value={settings.fontSize}
                onChange={(value) => dispatch(setFontSize(value))}
                min={16}
                max={48}
              />
              
              <SelectField
                label="Font Family"
                icon={Type}
                value={settings.fontFamily}
                onChange={(e) => dispatch(setFontFamily(e.target.value))}
                options={[
                  { value: "mono", label: "Monospace" },
                  { value: "serif", label: "Serif" },
                  { value: "sans", label: "Sans-serif" }
                ]}
              />
              
              <SelectField
                label="Cursor Style"
                icon={Type}
                value={settings.cursorStyle}
                onChange={(e) => dispatch(setCursorStyle(e.target.value))}
                options={[
                  { value: "block", label: "Block" },
                  { value: "line", label: "Line" },
                  { value: "underline", label: "Underline" }
                ]}
              />
              
              <SelectField
                label="Color Theme"
                icon={Palette}
                value={settings.colorTheme}
                onChange={(e) => dispatch(setColorTheme(e.target.value))}
                options={[
                  { value: "default", label: "Default" },
                  { value: "neon", label: "Neon" },
                  { value: "forest", label: "Forest" },
                  { value: "ocean", label: "Ocean" }
                ]}
              />
            </>
          )}
        </div>

        {/* Shortcuts */}
        <div className={`mt-8 p-4 rounded-lg border ${
          settings.theme === "dark"
            ? "bg-gray-700/30 border-gray-600/50 text-gray-400"
            : "bg-gray-50/50 border-gray-200/50 text-gray-600"
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Keyboard className="w-4 h-4" />
            <span className="font-medium">Keyboard Shortcuts</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span>New test</span>
              <kbd className={`px-2 py-1 rounded font-mono text-xs ${
                settings.theme === "dark"
                  ? "bg-gray-600 text-gray-300 border border-gray-500"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}>
                ESC
              </kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Focus input</span>
              <kbd className={`px-2 py-1 rounded font-mono text-xs ${
                settings.theme === "dark"
                  ? "bg-gray-600 text-gray-300 border border-gray-500"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}>
                Tab
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Options