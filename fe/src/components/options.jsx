import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage, setTheme } from '../store/slices/settingsSlice';

function Options() {
  const [languages, setLanguages] = useState([]);
  const dispatch = useDispatch();
  const currentLanguage = useSelector((state) => state.settings.language);
  const currentTheme = useSelector((state) => state.settings.theme);

  // Fix theme initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    } else {
      localStorage.setItem('theme', 'dark');
      dispatch(setTheme('dark'));
    }
  }, []); 

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const response = await fetch(`https://api.allorigins.win/raw?url=https://monkeytype.com/languages/_list.json`);
        const data = await response.json();
        if (data) {
          setLanguages(data);
        }
      } catch(err) {
        console.log(err);
      }
    }
    fetchLanguages();
  }, []);

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    localStorage.setItem('theme', newTheme);
    dispatch(setTheme(newTheme));
  };

  return (
    <div className={`rounded-lg p-6 shadow-lg ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-2xl font-bold mb-6 ${currentTheme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Options</h2>
      
      <div className="space-y-6">
        <div className="language-selector">
          <label htmlFor="language" className={`block mb-2 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Language
          </label>
          <select
            name="language"
            id="language"
            value={currentLanguage}
            onChange={(e) => dispatch(setLanguage(e.target.value))}
            className={`w-full rounded-md py-2 px-3 border focus:outline-none focus:ring-2 transition-all duration-200
              ${currentTheme === 'dark'
                ? 'bg-gray-700 text-gray-300 border-gray-600 focus:border-green-400 focus:ring-green-400/20'
                : 'bg-white text-gray-900 border-gray-300 focus:border-green-600 focus:ring-green-600/20'
              }`}
          >
            {languages.map((lang, index) => (
              <option key={index} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div className="theme-selector">
          <label htmlFor="theme" className={`block mb-2 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Theme
          </label>
          <select
            name="theme"
            id="theme"
            value={currentTheme}
            onChange={handleThemeChange}
            className={`w-full rounded-md py-2 px-3 border focus:outline-none focus:ring-2 transition-all duration-200
              ${currentTheme === 'dark'
                ? 'bg-gray-700 text-gray-300 border-gray-600 focus:border-green-400 focus:ring-green-400/20'
                : 'bg-white text-gray-900 border-gray-300 focus:border-green-600 focus:ring-green-600/20'
              }`}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        <div className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          <p className="mb-2">Keyboard Shortcuts:</p>
          <ul className="space-y-1">
            <li>
              <kbd className={`px-2 py-1 rounded ${currentTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>ESC</kbd>
              <span className="ml-2">New words</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Options;

