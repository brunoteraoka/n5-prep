import React, { useState, useRef, useEffect } from 'react';
import './Flashcard.css';

const Flashcard = ({ cardData, showFurigana, onSwipeLeft, onSwipeRight }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [cardData]);

  // --- AUDIO ENGINE ---
  const playAudio = (text, e) => {
    // 1. Prevent the card from flipping when clicking the speaker
    e.stopPropagation(); 

    // 2. Check if the browser supports text-to-speech
    if ('speechSynthesis' in window) {
      // 3. Clean out <rt> furigana tags so the voice doesn't read words twice
      const cleanText = text.replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]+>/g, '');
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ja-JP'; // Force Japanese pronunciation
      utterance.rate = 0.85;    // Slow it down slightly (default is 1)
      
      window.speechSynthesis.cancel(); // Stop any currently playing audio
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Your browser does not support text-to-speech audio.");
    }
  };

  // --- TOUCH LOGIC ---
  const handleTouchStart = (e) => {
    isDragging.current = false; 
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    
    if (
      Math.abs(touchCurrentX - touchStartX.current) > 10 ||
      Math.abs(touchCurrentY - touchStartY.current) > 10
    ) {
      isDragging.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    if (!isDragging.current) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (diffX > 50) {
      if (onSwipeLeft) onSwipeLeft();
    } else if (diffX < -50) {
      if (onSwipeRight) onSwipeRight();
    }

    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  const handleClick = () => {
    if (isDragging.current) return; 
    setIsFlipped(prev => !prev);
  };

  return (
    <div 
      className={`flashcard-wrapper ${isFlipped ? 'flipped' : ''} ${!showFurigana ? 'hide-furigana' : ''}`} 
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flashcard-inner">
        
        {/* FRONT OF CARD */}
        <div className="flashcard-front">
          <h1>{cardData.kanji}</h1>
          <button 
            className="audio-btn front-audio" 
            onClick={(e) => playAudio(cardData.kanji, e)}
            title="Listen to pronunciation"
          >
            🔊
          </button>
        </div>

        {/* BACK OF CARD */}
        <div className="flashcard-back">
          <div className="card-header">
            <h2>{cardData.meaning}</h2>
            <p className="mnemonic">💡 <em>{cardData.mnemonic}</em></p>
          </div>
          
          <hr className="divider" />
          
          <div className="readings-container">
            {cardData.examples.map((ex, index) => (
              <div key={index} className="example-block">
                <div className="vocab-header">
                  <span className="vocab-word" dangerouslySetInnerHTML={{ __html: ex.vocab }} />
                  <span className="vocab-meaning"> - {ex.meaning}</span>
                  <button 
                    className="audio-btn inline-audio" 
                    onClick={(e) => playAudio(ex.vocab, e)}
                  >
                    🔊
                  </button>
                </div>
                <div className="sentence-block">
                  <div className="sentence-row">
                    <p className="japanese-sentence" dangerouslySetInnerHTML={{ __html: ex.sentence }} />
                    <button 
                      className="audio-btn inline-audio" 
                      onClick={(e) => playAudio(ex.sentence, e)}
                    >
                      🔊
                    </button>
                  </div>
                  <p className="english-translation">{ex.translation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;