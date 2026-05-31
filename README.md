# JLPT N5 Mastery App 🇯🇵

A mobile-first, React-based web application designed to help learners conquer the Japanese Language Proficiency Test (JLPT) N5 level. It features a spaced-repetition flashcard deck and a highly accurate, dynamically generated mock exam engine.

Live Demo: [https://brunoteraoka.github.io/n5-flashcards](https://brunoteraoka.github.io/n5-flashcards)

## 🚀 Features

### 1. Active Recall Flashcards
* **Tinder-Style Swiping:** Full touch-gesture support for mobile. Swipe Right to mark a card as "Got It", Swipe Left to mark as "Missed".
* **Spaced Repetition Queue:** Cards swiped left are automatically added to a review queue at the end of the session.
* **Visual Feedback:** Satisfying, animated frosted-glass overlays (✅/❌) confirm grading actions.
* **Furigana Toggle:** Instantly show or hide hiragana readings above kanji to test pure recognition.

### 2. JLPT N5 Mock Examination Engine
* **Dynamic Generation:** Generates a 54-question exam strictly following the official JLPT N5 distribution slots (Vocabulary, Orthography, Grammar, Reading Comprehension, etc.).
* **Passage Grouping:** Intelligently groups reading comprehension questions that share the same text passage.
* **Real N5 Grading Logic:** Calculates scores out of 120 possible points, requiring both a minimum total score (38/120) and minimum section scores (19/60) to pass.
* **State Persistence:** Uses `localStorage` to track used question IDs, ensuring users don't see the same questions across multiple mock test sessions until the pool is exhausted.

### 3. Modern UI/UX
* **Mobile-First Layout:** Responsive CSS designed specifically to look and feel like a native iOS/Android application.
* **Slide-out Navigation:** A sleek hamburger menu with a blurred backdrop for seamless switching between the Flashcards and Mock Tests.

## 🛠️ Tech Stack
* **Frontend:** React.js (Hooks, Functional Components)
* **Styling:** Vanilla CSS (Flexbox, CSS Animations, Backdrop-filters)
* **Data Layer:** Local JSON files acting as the database (`n5-deck.json` and `n5_jlpt_questions.json`)
* **Deployment:** GitHub Pages

## 📦 Local Installation

To run this project locally on your machine:

1. Clone the repository:
```bash
   git clone [https://github.com/brunoteraoka/n5-flashcards.git](https://github.com/brunoteraoka/n5-flashcards.git)