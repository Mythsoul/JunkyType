import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-900 h-[70px] px-8 shadow-md">
      <div className="h-full max-w-7xl mx-auto flex items-center justify-between">
        <NavLink to="/" className="text-green-500 text-2xl font-bold no-underline">
          JunkeyType
        </NavLink>
        <div className="flex gap-8">
          <NavLink to="/" className="text-white hover:text-green-500 transition-colors duration-300 no-underline">
            Practice
          </NavLink>
          <NavLink to="/leaderboard" className="text-white hover:text-green-500 transition-colors duration-300 no-underline">
            Leaderboard
          </NavLink>
          <NavLink to="/profile" className="text-white hover:text-green-500 transition-colors duration-300 no-underline">
            Profile
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

