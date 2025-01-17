import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react'

function Settings() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Typing Test
        </button>

        <div className="text-center py-20">
          <SettingsIcon className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Settings</h2>
          <p className="text-gray-400">Settings page coming soon!</p>
        </div>
      </div>
    </div>
  )
}

export default Settings
