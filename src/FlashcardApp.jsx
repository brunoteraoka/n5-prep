import React, { useState } from 'react';
import Flashcard from './Flashcard';
import './App.css';
import deckData from './n5-deck.json';

function FlashcardApp({ navigateTo }) {
  const [deck, setDeck] = useState(deckData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFurigana, setShowFurigana] = useState(false);
  
  const [reviewQueue, setReviewQueue] = useState([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [flash, setFlash] = useState(null);

  // NEW: State to control the sliding menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- SWIPE TRACKING STATES ---
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50; 

  const onTouchStart = (e) => {
    // Prevent swiping the cards if the menu is open
    if (isMenuOpen) return; 
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    if (isMenuOpen) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (isMenuOpen || !touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) handleGrade(false); 
    if (isRightSwipe) handleGrade(true); 
  };

  const handleGrade = (knewIt) => {
    setFlash({ type: knewIt ? 'got-it' : 'missed-it', id: Date.now() });
    setTimeout(() => setFlash(null), 500);

    const currentCard = deck[currentIndex];
    if (!knewIt && !reviewQueue.some(c => c.id === currentCard.id)) {
      setReviewQueue([...reviewQueue, currentCard]);
    }

    if (currentIndex < deck.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishDeck();
    }
  };

  const finishDeck = () => {
    if (reviewQueue.length > 0) {
      setDeck(reviewQueue);
      setReviewQueue([]);
      setCurrentIndex(0);
      setIsReviewMode(true);
    } else {
      setSessionComplete(true);
    }
  };

  const restartSession = () => {
    const shuffled = [...deckData].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setReviewQueue([]);
    setIsReviewMode(false);
    setSessionComplete(false);
  };

  if (sessionComplete) {
    return (
      <div className="app-container">
        <h2>🎉 Session Complete!</h2>
        <p>You mastered all the cards in this batch.</p>
        <button className="nav-btn shuffle-btn" onClick={restartSession}>
          Start New Shuffled Session
        </button>
        <button className="nav-btn back-menu-btn" onClick={() => navigateTo('landing')}>
          🏠 Back to Main Menu
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`app-container ${showFurigana ? 'show-furigana' : 'hide-furigana'}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* ------------------------------------- */}
      {/* SLIDING SIDE MENU                     */}
      {/* ------------------------------------- */}
      <div 
        className={`side-menu-overlay ${isMenuOpen ? 'visible' : ''}`} 
        onClick={() => setIsMenuOpen(false)} 
      />
      
      <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h2>Menu</h2>
          <button className="close-menu-btn" onClick={() => setIsMenuOpen(false)}>✕</button>
        </div>
        <div className="menu-links">
          <button className="menu-item" onClick={() => navigateTo('landing')}>
            <span>🏠</span> Home
          </button>
          <button className="menu-item" onClick={() => navigateTo('mocktest')}>
            <span>📝</span> Mock Test
          </button>
        </div>
      </div>
      {/* ------------------------------------- */}

      {flash && (
        <div key={flash.id} className={`flash-overlay ${flash.type}`}>
          {flash.type === 'got-it' ? '✅ Got It!' : '❌ Missed!'}
        </div>
      )}

      {/* --- TOP HAMBURGER BUTTON --- */}
      <div className="app-top-nav">
        <button className="hamburger-btn" onClick={() => setIsMenuOpen(true)}>
          ☰
        </button>
      </div>

      <div className="controls-header">
        <label className="furigana-toggle">
          <input 
            type="checkbox" 
            checked={showFurigana}
            onChange={(e) => setShowFurigana(e.target.checked)}
          />
          Show Furigana
        </label>
        
        <button className="nav-btn shuffle-btn" onClick={restartSession} style={{ marginTop: '12px', marginBottom: '8px' }}>
          🔀 Shuffle & Restart
        </button>
        
        {isReviewMode && <div className="review-badge">⚠️ Reviewing Missed Cards</div>}
      </div>

      <Flashcard 
        key={deck[currentIndex].id} 
        cardData={deck[currentIndex]} 
        showFurigana={showFurigana}
      />

      <div className="navigation-buttons">
        <button className="nav-btn" style={{ backgroundColor: '#dc3545' }} onClick={() => handleGrade(false)}>
          ❌ Missed It
        </button>
        <span className="progress-text">{currentIndex + 1} / {deck.length}</span>
        <button className="nav-btn" style={{ backgroundColor: '#28a745' }} onClick={() => handleGrade(true)}>
          ✅ Got It
        </button>
      </div>

      <div style={{ marginTop: '20px', color: '#666' }}>Cards to review next round: {reviewQueue.length}</div>
      <div style={{ marginTop: '15px', color: '#999', fontSize: '0.85rem' }}><em>Swipe ⬅️ to miss, Swipe ➡️ to pass!</em></div>
    </div>
  );
}

export default FlashcardApp;