# ⛩️ JLPT N5 Mastery App

A mobile-first, interactive React application designed to help students master JLPT N5 vocabulary, kanji, grammar, and reading comprehension. The app features gesture-based flashcards, detailed conjugation decks, and a highly realistic mock examination engine.

## ✨ Core Features

### 1. Smart Flashcard Deck
* **Gesture-Based:** 3D flip animations with built-in swipe recognition (swipe left for missed, swipe right for known).
* **Audio Integration:** Built-in native Japanese pronunciation using the browser's Web Speech API for both single vocabulary and full sentences.
* **Spaced Repetition (SRS):** Automatically tracks missed cards and generates custom review decks.
* **Furigana Toggle:** Hide/show furigana to test true kanji reading comprehension.

### 2. Verb & Adjective Modules
* **Interactive Conjugations:** Swipeable cards detailing crucial N5 flexions (Te-form, Masu-form, Past, Negative).
* **Particle Notes:** Dedicated explanations detailing exactly which particle each verb requires.
* **Grammar Context:** Expandable drawers providing real-world sentence structures and usage tips.

### 3. Realistic JLPT Mock Examination
* **Dynamic Generation:** Automatically shuffles and pulls exactly 54 questions per test, matching the official N5 category distributions (Vocab, Kanji, Grammar, Reading).
* **Weighted Scoring:** Grades the exam out of 120 JLPT points (Reading questions are heavily weighted), calculating if the user meets the official 38-point passing threshold.
* **Reading Comprehension (Dokkai):** Specialized UI for reading passages (`pre-wrap` formatted) with associated questions.
* **Immediate Feedback UX:** Instantly highlights correct/incorrect answers upon selection and provides the explanation while the context is still fresh, before advancing to the next question.
* **Final Review Dashboard:** A comprehensive end-of-test breakdown showing points earned per question and missed concepts.

## 🚀 Recent Updates

* **Mock Test Overhaul:** Implemented immediate answer feedback, "Next Question" manual progression, and a weighted 120-point scoring system to perfectly simulate real JLPT conditions.
* **Reading Passages:** Added conditional rendering and CSS formatting to handle long-form Japanese text and line-breaks for Dokkai questions.
* **Adjectives Deck:** Deployed a dedicated swipeable deck for `i-adjectives` and `na-adjectives`, complete with type-badge highlighting.
* **Web Speech API:** Added zero-latency, offline-capable native text-to-speech audio for kanji and example sentences.

## 🛠️ Tech Stack

* **Frontend:** React.js (Hooks: `useState`, `useEffect`, `useRef`, `useCallback`)
* **Styling:** Pure CSS (Flexbox layout, Mobile Safe Area Insets, CSS Animations)
* **Audio:** Native HTML5 Web Speech API (`window.speechSynthesis`)
* **Data Handling:** Local, structured JSON arrays.

## 📦 Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

