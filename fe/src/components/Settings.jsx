import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  setTheme, 
  setFontSize, 
  setFontFamily, 
  setSoundEffects, 
  setShowLiveWPM, 
  setShowLiveAccuracy, 
  setDifficulty, 
  setIncludeNumbers, 
  setIncludePunctuation,
  setHighlightErrors,
  setSmoothCaret,
  loadSettings
} from '../store/slices/settingsSlice'
import { Palette, Type, Volume2, Eye, Gamepad2, Zap, Monitor } from 'lucide-react'

function Settings() {
  const dispatch = useDispatch()
  const settings = useSelector(state => state.settings)

  useEffect(() => {
    // Load settings from localStorage on component mount
    dispatch(loadSettings())
  }, [dispatch])

  const SettingCard = ({ icon: Icon, title, children, color = "blue" }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg bg-${color}-500/20`}>
          <Icon className={`w-5 h-5 text-${color}-400`} />
        </div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  )

  const ToggleButton = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
      <div>
        <div className="text-white font-medium">{label}</div>
        {description && <div className="text-gray-400 text-sm mt-1">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-500' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  const OptionGrid = ({ options, selected, onChange, columns = 3 }) => (
    <div className={`grid grid-cols-${columns} gap-3`}>
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`p-4 rounded-xl border-2 transition-all duration-200 ${option.style || ''} ${
            selected === option.value
              ? 'border-blue-500 bg-blue-500/20 text-blue-300'
              : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
          }`}
        >
          <div className="font-medium">{option.label}</div>
          {option.description && (
            <div className="text-xs text-gray-400 mt-1">{option.description}</div>
          )}
        </button>
      ))}
    </div>
  )

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      settings.theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-3 ${
            settings.theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Settings
          </h1>
          <p className={`text-lg ${
            settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Customize your typing experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Appearance */}
          <SettingCard icon={Palette} title="Appearance" color="purple">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 font-medium mb-3">Theme</label>
                <OptionGrid
                  options={[
                    { value: 'dark', label: 'Dark', description: 'Easy on eyes' },
                    { value: 'light', label: 'Light', description: 'Clean & bright' }
                  ]}
                  selected={settings.theme}
                  onChange={(value) => dispatch(setTheme(value))}
                  columns={2}
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-3">Font Family</label>
                <OptionGrid
                  options={[
                    { value: 'mono', label: 'Monospace', style: 'font-mono', description: 'Fixed width' },
                    { value: 'sans', label: 'Sans Serif', style: 'font-sans', description: 'Modern' },
                    { value: 'serif', label: 'Serif', style: 'font-serif', description: 'Traditional' }
                  ]}
                  selected={settings.fontFamily}
                  onChange={(value) => dispatch(setFontFamily(value))}
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-3">Font Size</label>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm">Small</span>
                  <input
                    type="range"
                    min="16"
                    max="32"
                    value={settings.fontSize}
                    onChange={(e) => dispatch(setFontSize(parseInt(e.target.value)))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-gray-400 text-sm">Large</span>
                  <span className="text-white font-medium w-12 text-center">{settings.fontSize}px</span>
                </div>
              </div>
            </div>
          </SettingCard>

          {/* Typing Experience */}
          <SettingCard icon={Type} title="Typing Experience" color="blue">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 font-medium mb-3">Difficulty</label>
                <OptionGrid
                  options={[
                    { value: 'easy', label: 'Easy', description: 'Short words' },
                    { value: 'normal', label: 'Normal', description: 'Mixed length' },
                    { value: 'hard', label: 'Hard', description: 'Complex words' }
                  ]}
                  selected={settings.difficulty}
                  onChange={(value) => dispatch(setDifficulty(value))}
                />
              </div>

              <ToggleButton
                checked={settings.includeNumbers}
                onChange={(value) => dispatch(setIncludeNumbers(value))}
                label="Include Numbers"
                description="Add numbers to typing tests"
              />

              <ToggleButton
                checked={settings.includePunctuation}
                onChange={(value) => dispatch(setIncludePunctuation(value))}
                label="Include Punctuation"
                description="Add punctuation marks"
              />

              <ToggleButton
                checked={settings.smoothCaret}
                onChange={(value) => dispatch(setSmoothCaret(value))}
                label="Smooth Caret"
                description="Animated cursor movement"
              />
            </div>
          </SettingCard>

          {/* Display Options */}
          <SettingCard icon={Monitor} title="Display Options" color="green">
            <div className="space-y-4">
              <ToggleButton
                checked={settings.showLiveWPM}
                onChange={(value) => dispatch(setShowLiveWPM(value))}
                label="Show Live WPM"
                description="Display words per minute while typing"
              />

              <ToggleButton
                checked={settings.showLiveAccuracy}
                onChange={(value) => dispatch(setShowLiveAccuracy(value))}
                label="Show Live Accuracy"
                description="Display accuracy percentage while typing"
              />

              <ToggleButton
                checked={settings.highlightErrors}
                onChange={(value) => dispatch(setHighlightErrors(value))}
                label="Highlight Errors"
                description="Highlight incorrect characters"
              />
            </div>
          </SettingCard>

          {/* Audio & Effects */}
          <SettingCard icon={Volume2} title="Audio & Effects" color="yellow">
            <div className="space-y-4">
              <ToggleButton
                checked={settings.soundEffects}
                onChange={(value) => dispatch(setSoundEffects(value))}
                label="Sound Effects"
                description="Play sounds while typing"
              />
            </div>
          </SettingCard>
        </div>

        {/* Preview Section */}
        <div className="mt-8">
          <SettingCard icon={Eye} title="Preview" color="indigo">
            <div className="p-6 bg-gray-900 rounded-xl">
              <div 
                className={`${settings.fontFamily === 'mono' ? 'font-mono' : settings.fontFamily === 'serif' ? 'font-serif' : 'font-sans'} text-gray-300`}
                style={{ fontSize: `${settings.fontSize}px` }}
              >
                The quick brown fox jumps over the lazy dog. This is how your typing test will look with current settings.
              </div>
            </div>
          </SettingCard>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }
      `}</style>
    </div>
  )
}

export default Settings
