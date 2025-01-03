import React, { useCallback, useMemo, useRef } from 'react';
import { useState , useEffect } from 'react';

const DisplayText = React.memo(({ targetText, userInput }) => {
  const visibleChars = useMemo(() => {
    return targetText.split('').slice(0 , 300);
  }, [targetText]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 w-full max-w-3xl transition-all">
      <div className="text-2xl font-mono leading-relaxed tracking-wide">
        {visibleChars.map((char, index) => (
          <span
            key={index}
            className={`transition-colors duration-150 ${
              index < userInput.length
                ? userInput[index] === char
                  ? 'text-emerald-500 font-medium'
                  : 'text-rose-500 bg-rose-100'
                : 'text-slate-600'
            }`}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
});

function Typearea() {
    const [Allwords, setAllwords] = useState([]);
    const [words, setWords] = useState([]);

  const [language, setLanguage] = useState('english');
  const [pressedKey, setPressedKey] = useState('');
  const [istextloading, setIstextloading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isTypingCorrect, setIsTypingCorrect] = useState(false);
  const [isTypinginCorrect, setIsTypinginCorrect] = useState(false);
  const [userwords , setUserwords] = useState(''); 
  const rafRef = useRef();
  const lastInputRef = useRef('');

  useEffect(() => {
    fetch(`https://api.allorigins.win/raw?url=https://monkeytype.com/languages/${language}.json`)
      .then(response => response.json())
      .then(data => {
        if (data.words) {
            setAllwords(data.words);
        }
      })
      .catch(error => console.error('Error fetching words:', error));
  }, [language]);

  useEffect(() => {
    if (Allwords.length > 0) {
      setIstextloading(true);
      getrandomWords();
    }
  }, [Allwords]);

useEffect(()=>{ 
    document.addEventListener('keyup', handlekeypress);
const key = pressedKey;
switch(key){ 
    case 'Escape': 
    getrandomWords();
    setTimeout(document.removeEventListener('keyup', handlekeypress)
    , 0.001);
    break; 
    default: 
    break;
}
})
  const handlekeypress = (e)=>{ 
    const key  = e.key;
    setPressedKey(key);
    setTimeout(() => {
        setPressedKey('');
    }, 0.001);
  }
  const compareText = useMemo(() => (input, target) => {
    return target.startsWith(input);
  }, []);

  const handleinput = useCallback((e) => {
    const value = e.target.value;
    
    // Cancel previous RAF if exists
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Avoid unnecessary updates
    if (value === lastInputRef.current) {
      return;
    }

    lastInputRef.current = value;

    // Schedule update in next frame
    rafRef.current = requestAnimationFrame(() => {
      setUserwords(value);
      const targetText = words.join(' ');

      if (value.length === 0) {
        setIsTyping(false);
        setIsTypingCorrect(false);
        setIsTypinginCorrect(false);
        return;
      }

      const isCorrect = compareText(value, targetText);
      
      setIsTyping(true);
      setIsTypingCorrect(isCorrect);
      setIsTypinginCorrect(!isCorrect);
    });
  }, [words, compareText]);

  async function getrandomWords(){ 

    try{ 
        if (Allwords.length === 0) return;
        const words = Array.from({length: Allwords.length}, () => Allwords[Math.floor(Math.random() * Allwords.length)]);

        setWords(words);
        setIstextloading(false);
        setUserwords(''); 
        
    }catch(err){ 
        console.error('Error fetching words:', err);
    }
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">JunkeyType</h1>
          <p className="text-slate-600">Test your typing speed</p>
        </div>

        {istextloading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse text-2xl text-slate-600">Loading...</div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Text Display */}
            <DisplayText targetText={words.join(' ')} userInput={userwords} />

            {/* Input Area */}
            <div className="flex justify-center">
              <input 
                type="text" 
                placeholder="Start typing..."
                className="w-full max-w-3xl h-14 px-6 rounded-lg border-2 border-slate-300 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                         text-xl font-mono transition-all
                         outline-none shadow-sm"
                onChange={handleinput}
                value={userwords}
                autoFocus
              />
            </div>

            {/* Status Messages */}
            <div className="h-20 flex items-center justify-center">
              {isTypingCorrect && (
                <div className="animate-fade-in text-2xl font-semibold text-emerald-500">
                  Perfect! 🎉
                </div>
              )}
              {isTypinginCorrect && (
                <div className="animate-fade-in text-2xl font-semibold text-rose-500">
                  Keep trying...
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="text-center text-slate-500 text-sm">
              Press <kbd className="px-2 py-1 bg-slate-100 rounded">ESC</kbd> for new words
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Add these styles to your tailwind.config.js
const tailwindConfig = {
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out'
      }
    }
  }
};

export default React.memo(Typearea);