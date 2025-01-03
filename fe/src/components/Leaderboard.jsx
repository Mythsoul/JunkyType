import React from 'react';

function Leaderboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-green-500 mb-6">Leaderboard</h2>
      <div className="bg-gray-900 rounded-lg shadow-lg p-6">
        <table className="w-full">
          <thead>
            <tr className="text-green-500 border-b border-gray-700">
              <th className="py-3 px-4 text-left">Rank</th>
              <th className="py-3 px-4 text-left">Username</th>
              <th className="py-3 px-4 text-left">WPM</th>
              <th className="py-3 px-4 text-left">Accuracy</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {/* Sample data - replace with actual data */}
            <tr className="border-b border-gray-800 hover:bg-gray-800">
              <td className="py-3 px-4">1</td>
              <td className="py-3 px-4">SpeedMaster</td>
              <td className="py-3 px-4">120</td>
              <td className="py-3 px-4">98%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
