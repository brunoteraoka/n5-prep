import React, { useState, useRef, useEffect } from 'react';
import './Flashcard.css';

const Flashcard = ({ cardData, showFurigana, onSwipeLeft, onSwipeRight }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  // If the card data changes (user clicked Next), ensure it flips back to the front
  useEffect(() => {
    setIsFlipped(false);
  }, [cardData]);

  const handleTouchStart = (e) => {
    isDragging.current = false; 
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    
    // If finger moves more than 10px, it's a drag, not a tap
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

    // Swiped Left
    if (diffX > 50) {
      if (onSwipeLeft) onSwipeLeft();
    } 
    // Swiped Right
    else if (diffX < -50) {
      if (onSwipeRight) onSwipeRight();
    }

    // Delay resetting the drag state so the onClick event doesn't fire accidentally
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
        <div className="flashcard-front">
          <h1>{cardData.kanji}</h1>
        </div>

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
                </div>
                <div className="sentence-block">
                  <p className="japanese-sentence" dangerouslySetInnerHTML={{ __html: ex.sentence }} />
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