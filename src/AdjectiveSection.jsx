import React, { useState, useRef } from 'react';
import './AdjectiveSection.css';
import adjectivesData from './data/adjectives.json';

const AdjectiveSection = ({ navigateTo }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedNotes, setExpandedNotes] = useState(false);

  const currentAdj = adjectivesData[currentIndex];

  // Swipe logic
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % adjectivesData.length);
    setExpandedNotes(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + adjectivesData.length) % adjectivesData.length);
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
    <div className="adj-page-layout">
      
      {/* THE ADJECTIVE CARD */}
      <div 
        className="adj-flashcard"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="adj-header">
          <div className="adj-kanji">
            <h1>{currentAdj.kanji}</h1>
            <span className="adj-kana">{currentAdj.kana}</span>
          </div>
          <div className="adj-info">
            <h3>{currentAdj.meaning}</h3>
            <span className={`adj-type badge-${currentAdj.type.split('-')[0].toLowerCase()}`}>
              {currentAdj.type}
            </span>
          </div>
        </div>

        <hr className="adj-divider" />

        <div className="flexions-grid">
          {currentAdj.flexions.map((flexion, index) => (
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
        {currentAdj.grammarNote && (
          <div className="grammar-drawer-container">
            <button 
              className="grammar-toggle-btn" 
              onClick={() => setExpandedNotes(!expandedNotes)}
            >
              {expandedNotes ? 'Hide Context ▲' : 'Read Grammar Context ▼'}
            </button>
            {expandedNotes && (
              <div className="grammar-note-content">
                <h4>{currentAdj.grammarNote.title}</h4>
                <p>{currentAdj.grammarNote.content}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="adj-bottom-controls">
        <p className="card-counter">{currentIndex + 1} / {adjectivesData.length}</p>
        <div className="adj-nav-buttons">
          <button className="btn-nav" onClick={handlePrev}>← Prev</button>
          <button className="btn-nav" onClick={handleNext}>Next →</button>
        </div>
      </div>

    </div>
  );
};

export default AdjectiveSection;