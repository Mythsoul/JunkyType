// //// Example simplified implementation
// const wordList = ["the", "be", "to", "of", "and", /* thousands more words */];

// function getRandomWords(count) {
//     let result = [];
//     for(let i = 0; i < count; i++) {
//         const randomIndex = Math.floor(Math.random() * wordList.length);
//         result.push(wordList[randomIndex]);
//     }
//     return result.join(' ');
// }

import axios from 'axios'
import React, { useEffect } from 'react'

function Home() {
  useEffect (async()=>{ 
       const words =  await axios.get("/api/english.json")
  },[])

  return (
    <div>
      <h1>Junkey Type</h1>
      <p>Test your typing speed</p>
    </div>
  )
}

export default Home