import React, { useState, useRef } from 'react';
import './VerbSection.css';
import verbsData from './data/verbs.json'; 

const VerbSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedNotes, setExpandedNotes] = useState(false);

  const currentVerb = verbsData[currentIndex];

  // Swipe logic
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % verbsData.length);
    setExpandedNotes(false); // Reset the drawer when changing cards
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + verbsData.length) % verbsData.length);
    setExpandedNotes(false);
  };

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

    if (diffX > 50) handleNext(); // Swiped left -> Next
    else if (diffX < -50) handlePrev(); // Swiped right -> Prev

    setTimeout(() => { isDragging.current = false; }, 50);
  };

  return (
    <div className="verb-page-layout">
      
      {/* THE VERB CARD */}
      <div 
        className="verb-flashcard"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="verb-header">
          <div className="verb-kanji">
            <h1>{currentVerb.kanji}</h1>
            <span className="verb-kana">{currentVerb.kana}</span>
          </div>
          <div className="verb-info">
            <h3>{currentVerb.meaning}</h3>
            <span className="verb-group">{currentVerb.group}</span>
          </div>
        </div>

        <hr className="verb-divider" />

        {/* NEW: Particle Note Section */}
        {currentVerb.particleNote && (
          <div className="particle-section">
            <div className="particle-badge">Particle: <strong>{currentVerb.particleNote.particle}</strong></div>
            <p className="particle-exp">{currentVerb.particleNote.explanation}</p>
            <p className="particle-example">ex: <em>{currentVerb.particleNote.example}</em></p>
          </div>
        )}

        <hr className="verb-divider" />

        <div className="flexions-grid">
          {currentVerb.flexions.map((flexion, index) => (
            <div key={index} className="flexion-row">
              <span className="flexion-name">{flexion.form}</span>
              <div className="flexion-japanese">
                <span className="flex-text">{flexion.japanese}</span>
                <span className="flex-romaji">{flexion.romaji}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Grammar Note Drawer */}
        {currentVerb.grammarNote && (
          <div className="grammar-drawer-container">
            <button 
              className="grammar-toggle-btn" 
              onClick={() => setExpandedNotes(!expandedNotes)}
            >
              {expandedNotes ? 'Hide Context ▲' : 'Read Grammar Context ▼'}
            </button>
            {expandedNotes && (
              <div className="grammar-note-content">
                <h4>{currentVerb.grammarNote.title}</h4>
                <p>{currentVerb.grammarNote.content}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="verb-bottom-controls">
        <p className="card-counter">{currentIndex + 1} / {verbsData.length}</p>
        <div className="verb-nav-buttons">
          <button className="btn-nav" onClick={handlePrev}>← Prev</button>
          <button className="btn-nav" onClick={handleNext}>Next →</button>
        </div>
      </div>

    </div>
  );
};

export default VerbSection;