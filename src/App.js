import React, { useState } from 'react';
import LandingPage from './LandingPage';
import FlashcardApp from './FlashcardApp';
import MockTest from './MockTest';
import VerbSection from './VerbSection';
import './App.css';

function App() {
  // This state determines which "page" is currently active
  // Options: 'landing', 'flashcards', 'mocktest', 'verbsection'
  const [currentPage, setCurrentPage] = useState('landing');
  
  // State to control the global menu drawer
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper function to change pages AND close the menu automatically
  const handleNavigation = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false); 
  };

  return (
    <div className="app-root">
      
      {/* GLOBAL MENU: Shows up on every page EXCEPT the Landing Page */}
      {currentPage !== 'landing' && (
        <>
          {/* The Top Bar with the Hamburger Icon */}
          <div className="app-top-nav">
            <button className="menu-button" onClick={() => setIsMenuOpen(true)}>
              ☰
            </button>
            <span className="nav-title">
              {currentPage === 'flashcards' && 'N5 Flashcards'}
              {currentPage === 'mocktest' && 'Mock Examination'}
              {currentPage === 'verbsection' && 'Verbs & Flexions'}
            </span>
          </div>

          {/* The Sliding Drawer Overlay */}
          {isMenuOpen && (
            <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}>
              <div className="menu-drawer" onClick={(e) => e.stopPropagation()}>
                <button className="close-menu-btn" onClick={() => setIsMenuOpen(false)}>
                  ✕
                </button>
                <nav className="menu-links">
                  <button onClick={() => handleNavigation('landing')}>🏠 Main Menu</button>
                  <button onClick={() => handleNavigation('flashcards')}>🎴 Flashcards</button>
                  <button onClick={() => handleNavigation('mocktest')}>📝 Mock Test</button>
                  <button onClick={() => handleNavigation('verbsection')}>🔄 Verbs</button>
                </nav>
              </div>
            </div>
          )}
        </>
      )}

      {/* PAGE ROUTING */}
      {currentPage === 'landing' && (
        <LandingPage navigateTo={handleNavigation} />
      )}
      
      {currentPage === 'flashcards' && (
        <FlashcardApp navigateTo={handleNavigation} />
      )}

      {currentPage === 'mocktest' && (
        <MockTest navigateTo={handleNavigation} />
      )}

      {currentPage === 'verbsection' && (
        <VerbSection navigateTo={handleNavigation} />
      )}
    </div>
  );
}

export default App;