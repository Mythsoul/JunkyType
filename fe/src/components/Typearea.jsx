import React from 'react'
import { useState , useEffect } from 'react';
function Typearea() {
    const [Allwords, setAllwords] = useState([]);
    const [words, setWords] = useState([]);

  const [language, setLanguage] = useState('english');
  const [pressedKey, setPressedKey] = useState('');
  const [istextloading, setIstextloading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isTypingCorrect, setIsTypingCorrect] = useState(false);
  const [isTypinginCorrect, setIsTypinginCorrect] = useState(false);
  
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
  const handleinput = (e) => {
    const value = e.target.value;
    const targetText = words.join(' ');
    const correct = value.split('').every((char, index) => {
      return char === targetText[index];
    });
  
    setIsTypingCorrect(correct && value.length > 0);
    setIsTypinginCorrect(!correct && value.length > 0);
  }
  async function getrandomWords(){ 
    try{ 
        if (Allwords.length === 0) return;
        const words = Array.from({length: Allwords.length}, () => Allwords[Math.floor(Math.random() * Allwords.length)]);

        setWords(words);
        setIstextloading(false);
    }catch(err){ 
        console.error('Error fetching words:', err);
    }
  }
return (

        <div className='flex justify-center  h-screen'>
            {istextloading && <p className="text-3xl font-mono p-4 m-10">Loading...</p>}
            <div className='words-box '>
              <div className="words m-32 border-black border-2 rounded p-4 text-red-700 font-mono text-xl" >
            {words.join(' ')}
            </div>
         
        <div className='typearea'>
<textarea type="text" placeholder='Enter the words above ' className='typearea border-black border-2 rounded text-xl ml-[300px]'  onChange={handleinput}/>
        </div>
        <div className='text-center'>
            {isTypingCorrect && <p className='text-3xl font-mono p-4 m-10'>Correct!</p>}
            {isTypinginCorrect && <p className='text-3xl font-mono p-4 m-10'>Incorrect!</p>}  
       </div>
        </div>
        </div>
        
)
}

export default Typearea