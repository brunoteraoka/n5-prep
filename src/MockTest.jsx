import React, { useState, useEffect, useCallback } from 'react';
import './MockTest.css';
import mockData from './data/mock-test.json'; 

const MockTest = ({ navigateTo }) => {
  
  // --- REAL N5 EXAM GENERATOR ---
  const generateMockTest = useCallback(() => {
    const allQuestions = mockData.questions || [];

    // 1. Sort the entire bank into the 4 official JLPT categories
    const vocabQs = allQuestions.filter(q => q.category === 'vocabulary' || q.category === 'kanji');
    const grammarQs = allQuestions.filter(q => q.category === 'grammar');
    const readingQs = allQuestions.filter(q => q.category === 'reading' || q.passage);
    const listeningQs = allQuestions.filter(q => !!q.audio_text); // Anything with audio is Listening

    // Helper function to shuffle and slice a specific amount
    const getRandom = (arr, count) => [...arr].sort(() => 0.5 - Math.random()).slice(0, count);

    // 2. Pull the exact N5 question distribution
    // (If your JSON has fewer than the requested amount, it safely just takes what is available)
    const examVocab = getRandom(vocabQs, 33);
    const examGrammar = getRandom(grammarQs, 26);
    const examReading = getRandom(readingQs, 6);
    const examListening = getRandom(listeningQs, 24);

    // 3. Combine them in the OFFICIAL JLPT exam order
    return [...examVocab, ...examGrammar, ...examReading, ...examListening];
  }, []);

  const [testQuestions, setTestQuestions] = useState(() => generateMockTest());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // REAL N5 TIME LIMIT: 105 Minutes total (6300 seconds)
  // We calculate it dynamically just in case the JSON didn't have enough questions to hit 89
  const totalExamTime = Math.floor((testQuestions.length / 89) * 105 * 60) || 6300;
  const [timeLeft, setTimeLeft] = useState(totalExamTime);

  const currentQ = testQuestions.length > 0 ? testQuestions[currentIndex] : null;

  // --- DETERMINE CURRENT EXAM SECTION FOR UI ---
  let currentSectionTitle = "Vocabulary / Kanji";
  if (currentQ) {
    if (currentQ.category === 'grammar') currentSectionTitle = "Grammar";
    if (currentQ.category === 'reading' || currentQ.passage) currentSectionTitle = "Reading";
    if (currentQ.audio_text) currentSectionTitle = "Listening";
  }

  useEffect(() => {
    if (showResults || !currentQ) return; 

    if (timeLeft <= 0) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setShowResults(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResults, currentQ]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`; // Shows hours if > 60 mins
  };

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP'; 
        utterance.rate = 0.85; 
        
        const voices = window.speechSynthesis.getVoices();
        const japaneseVoice = voices.find(v => v.lang.includes('ja') || v.lang.includes('JP'));
        if (japaneseVoice) utterance.voice = japaneseVoice;

        utterance.onerror = (e) => console.error("Audio error:", e.error);
        window.speechSynthesis.speak(utterance);
      }, 50);
    } else {
      alert("Your browser does not support Text-to-Speech audio.");
    }
  };

  useEffect(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.getVoices();
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const handleSelect = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQ.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel(); 
    
    if (currentIndex + 1 < testQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true); 
    }
  };

  const handleRestart = () => {
    const newTest = generateMockTest();
    setTestQuestions(newTest);
    setCurrentIndex(0);
    setScore(0);
    setShowResults(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(Math.floor((newTest.length / 89) * 105 * 60) || 6300); 
  };

  if (!currentQ) {
    return (
      <div className="mock-test-layout">
        <div className="question-card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>⚠️ Data Error</h2>
          <p>The mock test could not be generated. Please check your JSON format.</p>
        </div>
      </div>
    );
  }

  const isListeningQuestion = !!currentQ.audio_text;

  return (
    <div className="mock-test-layout">
      
      <div className="test-header">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="exam-badge">JLPT N5 Simulation</span>
          {/* 🚨 NEW: Shows the user what section they are in! */}
          <span style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px', fontWeight: 'bold' }}>
            {currentSectionTitle}
          </span>
        </div>
        
        <span className={`timer-badge ${timeLeft < 300 ? 'time-low' : ''}`}>
          ⏱️ {formatTime(timeLeft)}
        </span>
        <span className="question-counter">Q {currentIndex + 1} / {testQuestions.length}</span>
      </div>

      {!showResults ? (
        <div className="question-card">

          {/* --- READING PASSAGE BLOCK --- */}
          {currentQ.passage && (
            <div className="reading-passage-block">
              {currentQ.passage.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}

          {/* --- UNIVERSAL IMAGE BLOCK --- */}
          {currentQ.image_svg && (
            <div 
              className="svg-container" 
              dangerouslySetInnerHTML={{ __html: currentQ.image_svg }} 
            />
          )}
          
          {/* --- LISTENING VS STANDARD QUESTION LOGIC --- */}
          {isListeningQuestion ? (
            <div className="listening-block">
              <button className="play-audio-btn" onClick={() => playAudio(currentQ.audio_text)}>
                🔊 Play Audio
              </button>
              <h3 className="english-prompt">{currentQ.question}</h3>
            </div>
          ) : (
            <div className="standard-block">
              <h2 className="japanese-question">{currentQ.question}</h2>
              {currentQ.translation && <p className="question-translation">{currentQ.translation}</p>}
            </div>
          )}

          <hr className="test-divider" />

          {/* --- OPTIONS --- */}
          <div className="options-grid">
            {currentQ.options.map((option, idx) => {
              let btnClass = "option-btn";
              if (isAnswered) {
                if (option === currentQ.answer) btnClass += " correct";
                else if (option === selectedOption) btnClass += " incorrect";
                else btnClass += " disabled";
              }

              return (
                <button
                  key={idx}
                  className={btnClass}
                  onClick={() => handleSelect(option)}
                  disabled={isAnswered}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* --- FEEDBACK DRAWER --- */}
          {isAnswered && (
            <div className="feedback-section">
              <div className={`feedback-badge ${selectedOption === currentQ.answer ? 'correct' : 'incorrect'}`}>
                {selectedOption === currentQ.answer ? '✅ Correct' : '❌ Incorrect'}
              </div>

              {isListeningQuestion && (
                <div className="transcript-box">
                  <h4>Audio Transcript</h4>
                  <p className="japanese-transcript">{currentQ.audio_text}</p>
                  <p className="english-transcript">{currentQ.audio_text_translation}</p>
                </div>
              )}

              <p className="explanation-text"><strong>Explanation:</strong> {currentQ.explanation}</p>
              
              <button className="next-btn" onClick={handleNext}>
                {currentIndex + 1 === testQuestions.length ? 'See Results →' : 'Next Question →'}
              </button>
            </div>
          )}
        </div>
      ) : (
        
        <div className="results-card">
          <h2>Exam Complete! 📝</h2>
          
          <div className="score-circle">
            <span className="score-number">{score}</span>
            <span className="score-total">/ {testQuestions.length}</span>
          </div>
          
          <p className="score-percentage">
            Final Score: {Math.round((score / testQuestions.length) * 100)}%
          </p>
          <p className="time-taken">
            Time remaining: {formatTime(timeLeft)}
          </p>
          
          <button className="restart-test-btn" onClick={handleRestart}>
            Take Another Exam
          </button>
        </div>
      )}
    </div>
  );
};

export default MockTest;