import React, { useState, useEffect, useCallback } from 'react';
import './MockTest.css';
import mockTestData from './data/mock-test.json'; 

const MockTest = () => {
  // --- STATE ---
  const [testDeck, setTestDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [reviewAnswers, setReviewAnswers] = useState([]); 
  
  // NEW: State to hold the user's answer for the current question
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // --- REALISTIC N5 TEST CONFIGURATION ---
  const testConfig = {
    vocabulary: 20, 
    kanji: 10,      
    grammar: 18,    
    reading: 6      
  };

  // --- GENERATOR LOGIC ---
  const generateTest = useCallback(() => {
    const allQuestions = mockTestData.questions;
    if (!allQuestions || !Array.isArray(allQuestions)) return; 

    const shuffle = (array) => [...array].sort(() => 0.5 - Math.random());

    const vocabPool = shuffle(allQuestions.filter(q => q.category === 'vocabulary')).slice(0, testConfig.vocabulary);
    const kanjiPool = shuffle(allQuestions.filter(q => q.category === 'kanji')).slice(0, testConfig.kanji);
    const grammarPool = shuffle(allQuestions.filter(q => q.category === 'grammar')).slice(0, testConfig.grammar);
    const readingPool = shuffle(allQuestions.filter(q => q.category === 'reading')).slice(0, testConfig.reading);

    const newExam = [...vocabPool, ...kanjiPool, ...grammarPool, ...readingPool];
    
    setTestDeck(newExam);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setReviewAnswers([]);
    setSelectedAnswer(null); // Reset on new test
  }, [testConfig.vocabulary, testConfig.kanji, testConfig.grammar, testConfig.reading]); 

  useEffect(() => {
    generateTest();
  }, [generateTest]);

  // --- SAFETY CATCHES ---
  if (!mockTestData.questions) {
    return (
      <div className="mocktest-page-layout">
        <div className="test-stage" style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>⚠️ JSON Data Error</h2>
          <p>Could not load the questions. Please check mock-test.json</p>
          <p>Ensure it contains a <b>"questions": [ ... ]</b> property.</p>
        </div>
      </div>
    );
  }

  if (testDeck.length === 0) {
    return (
      <div className="mocktest-page-layout">
        <div className="test-stage" style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>⏳ Assembling Exam...</h2>
          <p>Shuffling {testConfig.vocabulary + testConfig.kanji + testConfig.grammar + testConfig.reading} questions...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = testDeck[currentIndex];

  const getQuestionWeight = (category) => {
    if (category === 'reading') return 4; 
    return 2; 
  };

  // --- HANDLERS ---
  const handleAnswerSelect = (option) => {
    // Prevent clicking if an answer is already selected
    if (selectedAnswer) return; 

    setSelectedAnswer(option);

    const isCorrect = option === currentQuestion.answer;
    const pointsEarned = isCorrect ? getQuestionWeight(currentQuestion.category) : 0;
    
    if (isCorrect) {
      setScore(prev => prev + pointsEarned); 
    }

    setReviewAnswers(prev => [...prev, {
      question: currentQuestion.question,
      passage: currentQuestion.passage,
      selected: option,
      correct: currentQuestion.answer,
      isCorrect: isCorrect,
      explanation: currentQuestion.explanation,
      points: pointsEarned
    }]);
  };

  // NEW: Function to manually advance to the next question
  const handleNextQuestion = () => {
    if (currentIndex + 1 < testDeck.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null); // Clear selection for the next question
    } else {
      setIsFinished(true);
    }
  };

  // --- RENDER ---
  return (
    <div className="mocktest-page-layout">
      
      {isFinished ? (
        <div className="completion-screen">
          <h2>Exam Complete! 🎓</h2>
          
          <div className="jlpt-score-box" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Estimated JLPT Score</h3>
            <p className="final-score" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff', margin: '0 0 10px 0' }}>
              {score} / 120 Points
            </p>
            {score >= 38 ? (
              <div className="pass-badge" style={{color: '#52c41a', fontWeight: 'bold'}}>
                ✅ Section Passed (Minimum 38 required)
              </div>
            ) : (
              <div className="fail-badge" style={{color: '#ff4d4f', fontWeight: 'bold'}}>
                ❌ Section Failed (Minimum 38 required)
              </div>
            )}
          </div>
          
          <div className="review-section">
            <h3>Review Your Answers:</h3>
            {reviewAnswers.map((ans, idx) => (
              <div key={idx} className={`review-card ${ans.isCorrect ? 'correct' : 'incorrect'}`}>
                {ans.passage && (
                  <div className="review-passage-snippet">
                    <p>{ans.passage.substring(0, 40)}...</p>
                  </div>
                )}
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <p className="review-q"><strong>Q:</strong> {ans.question}</p>
                  <span style={{fontSize: '0.85rem', color: '#888', whiteSpace: 'nowrap', marginLeft: '10px'}}>
                    {ans.isCorrect ? `+${ans.points} pts` : '0 pts'}
                  </span>
                </div>
                <p><strong>Your Answer:</strong> {ans.selected} {ans.isCorrect ? '✅' : '❌'}</p>
                {!ans.isCorrect && <p><strong>Correct Answer:</strong> {ans.correct}</p>}
                {ans.explanation && (
                  <p className="review-exp"><em>💡 {ans.explanation}</em></p>
                )}
              </div>
            ))}
          </div>

          <button className="btn-restart" onClick={generateTest}>
            Generate New Exam
          </button>
        </div>
      ) : (
        <div className="test-stage">
          
          <div className="progress-bar-container">
            <div className="progress-stats">
              <span style={{textTransform: 'capitalize', fontWeight: 'bold', color: '#007bff'}}>
                Section: {currentQuestion.category}
              </span>
              <span>Question {currentIndex + 1} of {testDeck.length}</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${((currentIndex) / testDeck.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="question-container">
            
            {currentQuestion.passage && (
              <div className="reading-passage-box">
                <p className="passage-text">{currentQuestion.passage}</p>
              </div>
            )}

            <h3 className="exam-question">{currentQuestion.question}</h3>

            <div className="options-grid">
              {currentQuestion.options.map((option, index) => {
                // Determine styling for options after user clicks
                let btnClass = "option-btn";
                if (selectedAnswer) {
                  if (option === currentQuestion.answer) {
                    btnClass += " correct-option"; // Highlight correct answer
                  } else if (option === selectedAnswer) {
                    btnClass += " incorrect-option"; // Highlight user's wrong answer
                  }
                }

                return (
                  <button 
                    key={index} 
                    className={btnClass} 
                    onClick={() => handleAnswerSelect(option)}
                    disabled={!!selectedAnswer} // Disable all buttons once an answer is chosen
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* NEW: Immediate Feedback & Explanation Box */}
            {selectedAnswer && (
              <div className="immediate-feedback-box">
                <h4 className={selectedAnswer === currentQuestion.answer ? "feedback-title-correct" : "feedback-title-incorrect"}>
                  {selectedAnswer === currentQuestion.answer ? "✅ Correct!" : "❌ Incorrect"}
                </h4>
                {currentQuestion.explanation && (
                  <p className="feedback-explanation"><strong>Explanation:</strong> {currentQuestion.explanation}</p>
                )}
                <button className="btn-next-question" onClick={handleNextQuestion}>
                  {currentIndex + 1 < testDeck.length ? "Next Question →" : "See Final Results →"}
                </button>
              </div>
            )}

          </div>
        </div>
      )}
      
    </div>
  );
};

export default MockTest;