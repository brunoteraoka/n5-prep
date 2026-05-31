import React, { useState, useRef } from 'react';
import './Flashcard.css';

const Flashcard = ({ cardData, showFurigana }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // We use these to figure out if it was a swipe or a tap
  const touchStartX = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e) => {
    isDragging.current = false; // Reset drag state on new touch
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    const touchCurrentX = e.touches[0].clientX;
    // If they moved their finger more than 10 pixels, it's a drag/swipe
    if (Math.abs(touchCurrentX - touchStartX.current) > 10) {
      isDragging.current = true;
    }
  };

  const handleClick = () => {
    // If they were swiping, DO NOT flip the card
    if (isDragging.current) {
      isDragging.current = false; // Reset for the next touch
      return; 
    }
    
    // If it was a normal tap or click, flip it!
    setIsFlipped(prev => !prev);
  };

  return (
    <div 
      className={`flashcard-wrapper ${isFlipped ? 'flipped' : ''} ${!showFurigana ? 'hide-furigana' : ''}`} 
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className="flashcard-inner">
        
        {/* FRONT FACE */}
        <div className="flashcard-front">
          <h1>{cardData.kanji}</h1>
        </div>

        {/* BACK FACE */}
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
                  <span 
                    className="vocab-word"
                    dangerouslySetInnerHTML={{ __html: ex.vocab }} 
                  />
                  <span className="vocab-meaning"> - {ex.meaning}</span>
                </div>

                <div className="sentence-block">
                  <p 
                    className="japanese-sentence"
                    dangerouslySetInnerHTML={{ __html: ex.sentence }} 
                  />
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