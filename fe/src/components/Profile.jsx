import React from 'react';

function Profile() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-green-500 mb-6">Profile</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Username:</span>
            <span className="text-white">User123</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Average WPM:</span>
            <span className="text-white">75</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Best WPM:</span>
            <span className="text-white">90</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Tests Completed:</span>
            <span className="text-white">42</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
