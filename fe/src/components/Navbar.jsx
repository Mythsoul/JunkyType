import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Navbar() {
  const theme = useSelector((state) => state.settings.theme);

  return (
    <nav className={theme === 'dark' ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-lg'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className={`text-2xl font-bold no-underline ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
            JunkeyType
          </Link>
          <div className="flex space-x-4">
            <NavLink to="/" className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium no-underline transition-colors duration-300
              ${isActive 
                ? theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-900'
                : theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }>
              Practice
            </NavLink>
            <NavLink to="/leaderboard" className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium no-underline transition-colors duration-300
              ${isActive 
                ? theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-900'
                : theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }>
              Leaderboard
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium no-underline transition-colors duration-300
              ${isActive 
                ? theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-900'
                : theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }>
              Profile
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

