import React from 'react';

function Profile() {
  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-8">
        <h2 className="text-3xl font-bold text-green-400 mb-6">Profile</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-700 pb-4">
            <span className="text-gray-400">Username:</span>
            <span className="text-white font-medium">User123</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-700 pb-4">
            <span className="text-gray-400">Average WPM:</span>
            <span className="text-white font-medium">75</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-700 pb-4">
            <span className="text-gray-400">Best WPM:</span>
            <span className="text-white font-medium">90</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Tests Completed:</span>
            <span className="text-white font-medium">42</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

