import React, { useState } from 'react';
import LandingPage from './LandingPage';
import FlashcardApp from './FlashcardApp';
import MockTest from './MockTest';
import './App.css';

function App() {
  // This state determines which "page" is currently active
  // Options: 'landing', 'flashcards', 'mocktest'
  const [currentPage, setCurrentPage] = useState('landing');

  return (
    <div className="app-root">
      {currentPage === 'landing' && (
        <LandingPage navigateTo={setCurrentPage} />
      )}
      
      {currentPage === 'flashcards' && (
        <FlashcardApp navigateTo={setCurrentPage} />
      )}

      {currentPage === 'mocktest' && (
        <MockTest navigateTo={setCurrentPage} />
      )}
    </div>
  );
}

export default App;