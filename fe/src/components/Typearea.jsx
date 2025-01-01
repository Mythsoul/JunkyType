import React from 'react'
import { useState , useEffect } from 'react';
function Typearea() {
    const [Allwords, setAllwords] = useState([]);
    const [words, setWords] = useState([]);

  const [language, setLanguage] = useState('english');
  const [pressedKey, setPressedKey] = useState('');
  const [istextloading, setIstextloading] = useState(false);

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

        <div className='flex justify-center items-center h-screen'>
            {istextloading && <p className="text-3xl font-mono p-4 m-10">Loading...</p>}
            <div className="words flex flex-wrap justify-center m-[100px]">
                {words.map((word, index) => { 
                    return <div key={index} className="word text-black m-1   p-2 borderrounded">{word}</div>
                })}
            </div>
        </div>
)
}

export default Typearea