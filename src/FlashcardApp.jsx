import React, { useState, useCallback } from 'react';
import Flashcard from './Flashcard';
import flashcardsData from './data/n5-deck.json'; // Adjust path if needed

const FlashcardApp = () => {
  // Deck & Progress State
  const [deck, setDeck] = useState(flashcardsData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [missedCards, setMissedCards] = useState([]);
  const [isReviewingMissed, setIsReviewingMissed] = useState(false);
  
  // UI State
  const [showFurigana, setShowFurigana] = useState(true);
  const [feedback, setFeedback] = useState(null); // 'missed' | 'got_it' | null

  // --- ACTIONS ---
  
  const showFeedback = (type) => {
    setFeedback(type);
    setTimeout(() => setFeedback(null), 600); // Banner flashes for 0.6 seconds
  };

  const advanceCard = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handleMissed = useCallback(() => {
    if (currentIndex < deck.length) {
      const currentCard = deck[currentIndex];
      // Add to missed list if it's not already there
      if (!missedCards.some(c => c.id === currentCard.id)) {
        setMissedCards(prev => [...prev, currentCard]);
      }
      showFeedback('missed');
      advanceCard();
    }
  }, [currentIndex, deck, missedCards, advanceCard]);

  const handleGotIt = useCallback(() => {
    if (currentIndex < deck.length) {
      showFeedback('got_it');
      advanceCard();
    }
  }, [currentIndex, deck, advanceCard]);

  // --- DECK CONTROLS ---

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
  };

  const handleRestart = () => {
    setDeck(flashcardsData);
    setCurrentIndex(0);
    setMissedCards([]);
    setIsReviewingMissed(false);
  };

  const handleReviewMissed = () => {
    if (missedCards.length > 0) {
      setDeck(missedCards);
      setCurrentIndex(0);
      setMissedCards([]); // Reset missed array for the new run
      setIsReviewingMissed(true);
    }
  };

  // --- RENDER LOGIC ---
  const isComplete = currentIndex >= deck.length;

  return (
    <div className="flashcard-page-layout">
      
      {/* DECK CONTROLS (Top Menu) */}
      <div className="deck-controls">
        <span className="deck-mode-badge">
          {isReviewingMissed ? '🔄 Reviewing Missed' : '📚 Standard Deck'}
        </span>
        <div className="deck-actions">
          <button onClick={handleShuffle} title="Shuffle Deck">🔀</button>
          <button onClick={handleRestart} title="Restart Deck">🔄</button>
        </div>
      </div>

      {/* THE FLASHCARD OR COMPLETION SCREEN */}
      <div className="flashcard-stage">
        
        {/* FLASHING FEEDBACK BANNER */}
        {feedback && (
          <div className={`feedback-banner ${feedback}`}>
            {feedback === 'missed' ? '❌ Missed it' : '✅ Got it!'}
          </div>
        )}

        {!isComplete ? (
          <Flashcard 
            cardData={deck[currentIndex]} 
            showFurigana={showFurigana} 
            onSwipeLeft={handleMissed}   // Swipe Left = Missed
            onSwipeRight={handleGotIt}   // Swipe Right = Got It
          />
        ) : (
          <div className="completion-screen">
            <h2>Deck Complete! 🎉</h2>
            <p>You missed {missedCards.length} cards.</p>
            <div className="completion-actions">
              {missedCards.length > 0 && (
                <button className="btn-review" onClick={handleReviewMissed}>
                  Review Missed ({missedCards.length})
                </button>
              )}
              <button className="btn-restart" onClick={handleRestart}>
                Restart Full Deck
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM CONTROLS */}
      {!isComplete && (
        <div className="bottom-controls">
          
          <div className="progress-bar-container">
            <div className="progress-stats">
              <span>{currentIndex + 1} / {deck.length}</span>
              <span className="missed-count">Missed: {missedCards.length}</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${((currentIndex) / deck.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <button 
            className="toggle-furigana-btn" 
            onClick={() => setShowFurigana(!showFurigana)}
          >
            {showFurigana ? '👁️ Hide Furigana' : '🙈 Show Furigana'}
          </button>
          
          <div className="grading-buttons">
            <button className="btn-missed" onClick={handleMissed}>❌ Missed</button>
            <button className="btn-got-it" onClick={handleGotIt}>✅ Got it</button>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default FlashcardApp;