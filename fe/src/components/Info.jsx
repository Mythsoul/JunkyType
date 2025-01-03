import React from 'react';

const Info = ({ wpm, isTypingCorrect, isStarted }) => {
  return (
    <div className="fixed right-10 top-1/2 transform -translate-y-1/2">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-700">Stats</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-500">Speed</p>
              <p className="text-3xl font-bold text-blue-600">
                {isStarted ? wpm : 0} <span className="text-sm">WPM</span>
              </p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500">Status</p>
              <div className={`text-lg font-medium ${
                isTypingCorrect ? 'text-emerald-500' : 'text-rose-500'
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
    </div>
  );
};

export default Info;
