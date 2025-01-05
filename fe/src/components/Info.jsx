import React from 'react';
import { useSelector } from 'react-redux';

const Info = ({ wpm, isTypingCorrect, isStarted }) => {
  const theme = useSelector((state) => state.settings.theme);

  return (
    <div className={`rounded-lg shadow-lg p-6 space-y-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="space-y-2">
        <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Stats</h2>
        <div className="space-y-3">
          <div>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Speed</p>
            <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              {isStarted ? wpm : 0} <span className="text-sm">WPM</span>
            </p>
          </div>
          
          <div>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Status</p>
            <div className={`text-lg font-medium ${
              isTypingCorrect 
                ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                : theme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`}>
              {isStarted ? (
                isTypingCorrect ? '✓ Correct' : '× Incorrect'
              ) : 'Not started'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;

