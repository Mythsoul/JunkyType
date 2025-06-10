import { memo } from "react"
import { useSelector } from "react-redux"

export const WordState = {
  CORRECT: 'correct',
  INCORRECT: 'incorrect',
  EXTRA: 'extra',
  CURRENT: 'current',
  UPCOMING: 'upcoming'
}

const Word = memo(({ word, state, theme, currentCharIndex = -1 }) => {
  const chars = word.split("").map((char, idx) => {
    const isActive = state === WordState.CURRENT && idx === currentCharIndex;
    
    const className = `${
      state === WordState.CORRECT ? "text-emerald-500" :
      state === WordState.INCORRECT ? "text-red-500" :
      state === WordState.CURRENT ? 
        (idx < currentCharIndex ? "text-emerald-500" :
         idx === currentCharIndex ? `${theme === "dark" ? "text-gray-300" : "text-gray-700"}` :
         theme === "dark" ? "text-gray-500" : "text-gray-400") :
      theme === "dark" ? "text-gray-500" : "text-gray-400"
    } ${isActive ? "relative after:absolute after:h-full after:w-0.5 after:bg-blue-500 after:-right-0.5 after:top-0 after:animate-pulse" : ""}`;

    return (
      <span key={idx} className={className}>
        {char}
      </span>
    );
  });

  return (
    <div className="inline-block mr-2">
      {chars}
    </div>
  );
});

const Words = memo(({ targetWords, inputWords, theme }) => {
  const currentWordIndex = inputWords.length - 1;
  const currentWord = inputWords[currentWordIndex] || "";

  return (
    <>
      {targetWords.map((word, idx) => (
        <Word
          key={`${word}-${idx}`}
          word={word}
          state={
            idx < currentWordIndex
              ? inputWords[idx] === word
                ? WordState.CORRECT
                : WordState.INCORRECT
              : idx === currentWordIndex
              ? WordState.CURRENT
              : WordState.UPCOMING
          }
          theme={theme}
          currentCharIndex={idx === currentWordIndex ? currentWord.length : -1}
        />
      ))}
    </>
  );
});

export { Word, Words };
