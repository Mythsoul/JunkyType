import React from 'react';

function Leaderboard() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-green-400 mb-6">Leaderboard</h2>
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700 text-green-400">
              <th className="py-3 px-4 text-left">Rank</th>
              <th className="py-3 px-4 text-left">Username</th>
              <th className="py-3 px-4 text-left">WPM</th>
              <th className="py-3 px-4 text-left">Accuracy</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {/* Sample data - replace with actual data */}
            <tr className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200">
              <td className="py-3 px-4">1</td>
              <td className="py-3 px-4">SpeedMaster</td>
              <td className="py-3 px-4">120</td>
              <td className="py-3 px-4">98%</td>
            </tr>
            {/* Add more rows here */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;

