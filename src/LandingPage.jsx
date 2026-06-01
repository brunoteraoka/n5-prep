import React from 'react';
import './LandingPage.css';

function LandingPage({ navigateTo }) {
  return (
    <div className="landing-container">
      <header className="hero-section">
        <h1 className="hero-title">N5 Mastery 🇯🇵</h1>
        <p className="hero-subtitle">The ultimate toolkit to conquer your first Japanese Language Proficiency Test.</p>
      </header>

      <main className="module-grid">
        {/* Flashcards Card */}
        <button className="module-card" onClick={() => navigateTo('flashcards')}>
          <div className="module-icon">🎴</div>
          <h2 className="module-title">Active Recall Flashcards</h2>
          <p className="module-desc">Master all 100 N5 Kanji using spaced repetition and real-world example sentences.</p>
          <div className="module-action">Start Studying →</div>
        </button>

        {/* Mock Test Card */}
        <button className="module-card" onClick={() => navigateTo('mocktest')}>
          <div className="module-icon">📝</div>
          <h2 className="module-title">Mock Examination</h2>
          <p className="module-desc">Simulate the real JLPT environment with a timed, multiple-choice grammar and vocab test.</p>
          <div className="module-action">Take the Test →</div>
        </button>

        {/* Verbs Section Card */}
        <button className="module-card" onClick={() => navigateTo('verbsection')}>
          <div className="module-icon">🔄</div>
          <h2 className="module-title">Verbs & Flexions</h2>
          <p className="module-desc">Master essential N5 verb groups and their crucial conjugations, including the Te-form and Masu-form.</p>
          <div className="module-action">Study Verbs →</div>
        </button>

        {/* Adjectives Section Card */}
        <button className="module-card" onClick={() => navigateTo('adjectives')}>
          <div className="module-icon">✨</div>
          <h2 className="module-title">Adjectives & Conjugations</h2>
          <p className="module-desc">Master the rules for i-adjectives and na-adjectives, including their past, negative, and Te-forms.</p>
          <div className="module-action">Study Adjectives →</div>
        </button>

      </main>

      <footer className="landing-footer">
        <p>Built for effective learning.</p>
      </footer>
    </div>
  );
}

export default LandingPage;