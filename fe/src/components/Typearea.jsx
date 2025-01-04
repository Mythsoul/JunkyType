import React from 'react';
import { useState, useEffect } from 'react';
import Info from './Info';

const DisplayText = ({ targetText, userInput }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 w-full max-w-3xl select-none">
      <div className="text-2xl font-mono leading-relaxed tracking-wide">
        {targetText.split('').map((char, index) => (
          <span
            key={index}
            className={
              index < userInput.length
                ? userInput[index] === char
                  ? 'text-emerald-500 font-medium'
                  : 'text-rose-500 bg-rose-100'
                : 'text-slate-600'
            }
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

function Typearea() {
  // Add new states for WPM calculation
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const [Allwords, setAllwords] = useState([]);
  const [words, setWords] = useState([]);
  const [language, setLanguage] = useState('english');
  const [pressedKey, setPressedKey] = useState('');
  const [istextloading, setIstextloading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isTypingCorrect, setIsTypingCorrect] = useState(false);
  const [isTypinginCorrect, setIsTypinginCorrect] = useState(false);
  const [userwords, setUserwords] = useState('');

  // Fetch words only once on mount
  useEffect(() => {
    const fetchWords = async () => {
      try {
        setIstextloading(true);
        const response = await fetch(`https://api.allorigins.win/raw?url=https://monkeytype.com/languages/${language}.json`);
        const data = await response.json();
        if (data.words) {
          setAllwords(data.words);
          await getrandomWords(data.words);
        }
      } catch (error) {
        console.error('Error fetching words:', error);
      } finally {
        setIstextloading(false);
      }
    };
    fetchWords();
  }, [language]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default actions for all keys except allowed ones
      if (!['Escape', 'Backspace', 'Tab'].includes(e.key) && !e.key.match(/^[a-zA-Z0-9\s]$/)) {
        e.preventDefault();
      }

      if (e.key === 'Escape') {
        getrandomWords(Allwords);
      }
    };

    const preventCopy = (e) => {
      e.preventDefault();
      return false;
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', preventCopy);
    document.addEventListener('paste', preventCopy);
    document.addEventListener('cut', preventCopy);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('paste', preventCopy);
      document.removeEventListener('cut', preventCopy);
    };
  }, [Allwords]);

  const calculateWPM = (text) => {
    if (!startTime || text.length === 0) return 0;
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
    const words = text.length / 5; // standard word length
    return Math.round(words / timeElapsed);
  };

  const handleinput = (e) => {
    const value = e.target.value;
    setUserwords(value);
    const targetText = words.join(' ');

  
    if (!isStarted && value.length === 1) {
      setStartTime(Date.now());
      setIsStarted(true);
    }

    if (!value) {
      setIsTyping(false);
      setIsTypingCorrect(false);
      setIsTypinginCorrect(false);
      return;
    }

    // Calculate WPM
    setWpm(calculateWPM(value));

    setIsTyping(true);
    const isCorrect = targetText.startsWith(value);
    setIsTypingCorrect(isCorrect);
    setIsTypinginCorrect(!isCorrect);

    // If typed everything correctly
    if (value === targetText) {
      setTimeout(() => getrandomWords(Allwords), 500);
    }
  };

  async function getrandomWords(wordList){ 
    try {
      if (!wordList?.length) return;
      
      // Get 25 random words
      const randomWords = Array.from(
        { length: 25 }, 
        () => wordList[Math.floor(Math.random() * wordList.length)]
      );

      setWords(randomWords);
      setUserwords('');
      setIsTyping(false);
      setIsTypingCorrect(false);
      setIsTypinginCorrect(false);
      setStartTime(null);
      setWpm(0);
      setIsStarted(false);
    } catch(err) {
      console.error('Error generating words:', err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6 select-none">
      <Info 
        wpm={wpm}
        isTypingCorrect={isTypingCorrect}
        isStarted={isStarted}
      />
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">JunkeyType</h1>
    
          <div className="flex justify-center items-center gap-4">
            <p className="text-slate-600">Test your typing speed</p>
            {isStarted && (
              <p className="text-2xl font-bold text-blue-600">
                {wpm} WPM
              </p>
            )}
          </div>
        </div>

        {istextloading ? (
          <div className="flex justify-center items-center h-40">
            <div className="text-2xl text-slate-600">Loading...</div>
          </div>
        ) : (
          <div className="space-y-8">
            <DisplayText targetText={words.join(' ')} userInput={userwords} />
            <div className="flex justify-center">
              <textarea
                placeholder="Start typing..."
                className="w-full max-w-3xl h-24 px-6 rounded-lg border-2 border-slate-300 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                         text-xl font-mono outline-none shadow-sm"
                onChange={handleinput}
                value={userwords}
                style={{ resize: 'none' }}
                onDragStart={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                maxLength={isTypinginCorrect ? userwords.length : words.join(' ').length}
              />
            </div>
            <div className="text-center text-slate-500 text-sm">
              Press <kbd className="px-2 py-1 bg-slate-100 rounded">ESC</kbd> for new words
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Typearea;