# ⛩️ JLPT N5 Mastery App

A mobile-first, interactive React application designed to help students master JLPT N5 vocabulary, kanji, and verb conjugations. The app features gesture-based flashcards, spaced repetition tracking, and detailed grammar context.

## ✨ Core Features

*   **Smart Flashcard Deck:** 
    *   3D flip animations with built-in swipe recognition (swipe left for missed, swipe right for known).
    *   Intelligent touch handling that distinguishes between vertical scrolling (to read example sentences) and horizontal swiping.
    *   Furigana toggle to test true kanji reading comprehension.
*   **Spaced Repetition System (SRS):**
    *   Automatically tracks missed cards during a session.
    *   Generates a custom "Review Missed" deck at the end of the session to reinforce weak points.
    *   Visual progress bar and dynamic session statistics.
*   **Verb & Conjugation Module:**
    *   Swipeable verb cards detailing crucial N5 flexions (Te-form, Masu-form, Past, Negative).
    *   Dedicated **Particle Notes** explaining which particle each verb requires.
    *   Expandable **Grammar Context** drawers for deep-dives into sentence structure.
*   **Mock Examination:** 
    *   Simulated JLPT testing environment for grammar and vocabulary.
*   **Mobile-First "Holy Grail" Layout:** 
    *   Strict viewport constraints to prevent horizontal/vertical overflow on mobile devices.
    *   A persistent, global sliding hamburger menu that safely avoids iOS/Android screen notches.

## 🚀 Recent Updates

*   **Global Navigation:** Extracted the menu system into `App.js` to provide a persistent, slide-out hamburger menu across all modules (Flashcards, Verbs, Mock Test).
*   **Verb Deck Overhaul:** Transitioned the verb list into a swipeable flashcard deck, adding specific grammar and particle explanations to each card.
*   **Layout Engine Refactor:** Implemented viewport height (`vh`) bounding and flexbox centering (`margin: auto`) to guarantee the flashcard banner stays perfectly centered without breaking mobile device dimensions.
*   **Restored SRS & Feedback:** Re-integrated the missed card tracking array and added a central, non-blocking flashing feedback banner (✅ Got it / ❌ Missed it) that triggers on swipes or button presses.

## 🛠️ Tech Stack

*   **Frontend:** React.js (Hooks: `useState`, `useEffect`, `useRef`, `useCallback`)
*   **Styling:** Pure CSS (Flexbox, CSS Animations, Mobile Media Queries, Safe Area Insets)
*   **Data Handling:** Local JSON arrays mapping Kanji, Vocab, and Verb groups.

## 📦 Getting Started

### Prerequisites
Make sure you have Node.js and npm installed.
