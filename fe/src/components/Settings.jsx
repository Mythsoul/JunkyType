import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserSettings, saveUserSettings } from '../utils/localStorage'
import { Settings as SettingsIcon, Palette, Type, Volume2, Eye, Save } from 'lucide-react'

function Settings() {
  const dispatch = useDispatch()
  const reduxSettings = useSelector(state => state.settings)
  const [localSettings, setLocalSettings] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const settings = getUserSettings()
    setLocalSettings(settings)
  }, [])

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }))
    setHasChanges(true)
    
    // Update Redux store immediately for live preview
    dispatch({ type: `settings/set${key.charAt(0).toUpperCase() + key.slice(1)}`, payload: value })
  }

  const handleSaveSettings = () => {
    if (localSettings) {
      saveUserSettings(localSettings)
      setHasChanges(false)
    }
  }

  const handleResetSettings = () => {
    const defaultSettings = {
      theme: 'dark',
      fontSize: 'medium',
      fontFamily: 'mono',
      soundEnabled: false,
      showLiveWPM: true,
      showLiveAccuracy: true,
      difficulty: 'normal',
      includeNumbers: false,
      includePunctuation: false
    }
    setLocalSettings(defaultSettings)
    setHasChanges(true)
  }

  if (!localSettings) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <SettingsIcon className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-400">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-gray-400">Customize your typing experience</p>
          </div>
          {hasChanges && (
            <button
              onClick={handleSaveSettings}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          )}
        </div>

        <div className="space-y-8">
          {/* Appearance Settings */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold">Appearance</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  {['dark', 'light'].map(theme => (
                    <button
                      key={theme}
                      onClick={() => handleSettingChange('theme', theme)}
                      className={`p-3 rounded-lg border-2 transition-colors capitalize ${
                        localSettings.theme === theme
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Font Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {['small', 'medium', 'large'].map(size => (
                    <button
                      key={size}
                      onClick={() => handleSettingChange('fontSize', size)}
                      className={`p-3 rounded-lg border-2 transition-colors capitalize ${
                        localSettings.fontSize === size
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Font Family */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Font Family</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {[
                  { value: 'mono', label: 'Monospace', style: 'font-mono' },
                  { value: 'sans', label: 'Sans Serif', style: 'font-sans' },
                  { value: 'serif', label: 'Serif', style: 'font-serif' }
                ].map(font => (
                  <button
                    key={font.value}
                    onClick={() => handleSettingChange('fontFamily', font.value)}
                    className={`p-3 rounded-lg border-2 transition-colors ${font.style} ${
                      localSettings.fontFamily === font.value
                        ? 'border-green-500 bg-green-500/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Typing Settings */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Type className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold">Typing</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  {['easy', 'normal', 'hard'].map(diff => (
                    <button
                      key={diff}
                      onClick={() => handleSettingChange('difficulty', diff)}
                      className={`p-3 rounded-lg border-2 transition-colors capitalize ${
                        localSettings.difficulty === diff
                          ? 'border-orange-500 bg-orange-500/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Options */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Content</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.includeNumbers}
                      onChange={(e) => handleSettingChange('includeNumbers', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">Include Numbers</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.includePunctuation}
                      onChange={(e) => handleSettingChange('includePunctuation', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">Include Punctuation</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-bold">Display</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.showLiveWPM}
                    onChange={(e) => handleSettingChange('showLiveWPM', e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm">Show Live WPM</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.showLiveAccuracy}
                    onChange={(e) => handleSettingChange('showLiveAccuracy', e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm">Show Live Accuracy</span>
                </label>
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Volume2 className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold">Audio</h2>
            </div>
            
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.soundEnabled}
                  onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                  className="w-4 h-4 text-yellow-600 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                />
                <span className="text-sm">Enable Typing Sounds</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleSaveSettings}
              disabled={!hasChanges}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                hasChanges
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Save Settings
            </button>
            <button
              onClick={handleResetSettings}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
