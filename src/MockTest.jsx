import React, { useState, useEffect } from 'react';
import './MockTest.css';
import questionsDatabase from './data/mock-test.json';
import { generateMockExam } from './examEngine';

function MockTest({ navigateTo }) {
  const [examData, setExamData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const [sec1Score, setSec1Score] = useState(0);
  const [sec2Score, setSec2Score] = useState(0);
  const [testComplete, setTestComplete] = useState(false);

  useEffect(() => {
    try {
      // Passes the array securely to the engine
      const newExam = generateMockExam(questionsDatabase.questions || []);
      setExamData(newExam);
    } catch (error) {
      console.error("Exam generation failed:", error);
      setExamData({ questions: [], sec1Length: 0, sec2Length: 0 });
    }
  }, []);

  if (!examData) {
    return <div className="test-container" style={{ padding: '40px', textAlign: 'center' }}>Loading Exam...</div>;
  }

  // Safety net if the database doesn't have enough correctly-tagged questions
  if (examData.questions.length === 0 || !examData.questions[currentIndex]) {
    return (
      <div className="test-container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>⚠️ Exam Generation Failed</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          We couldn't find enough matching questions in your database. Ensure your JSON matches the required criteria.
        </p>
        <button className="test-btn secondary" onClick={() => navigateTo('landing')}>← Back</button>
      </div>
    );
  }

  const currentQuestion = examData.questions[currentIndex];
  const isSection1 = currentIndex < examData.sec1Length;

  const handleOptionClick = (option) => {
    if (isAnswered) return; 

    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQuestion.answer) {
      if (isSection1) setSec1Score(prev => prev + 1);
      else setSec2Score(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < examData.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setTestComplete(true);
    }
  };

  if (testComplete) {
    const scaledSec1 = examData.sec1Length > 0 ? Math.round((sec1Score / examData.sec1Length) * 60) : 0;
    const scaledSec2 = examData.sec2Length > 0 ? Math.round((sec2Score / examData.sec2Length) * 60) : 0;
    const totalScore = scaledSec1 + scaledSec2;
    const passed = totalScore >= 38 && scaledSec1 >= 19 && scaledSec2 >= 19;

    return (
      <div className="test-container">
        <div className="results-screen">
          <h2>{passed ? '🎉 You Passed!' : 'Needs More Study'}</h2>
          
          <div className={`score-circle ${passed ? 'passed' : 'failed'}`}>
            <span className="score-number">{totalScore}</span>
            <span style={{fontSize: '1rem'}}>/ 120</span>
          </div>
          
          <div className="score-breakdown">
            <p><strong>Section 1 (Vocab):</strong> {scaledSec1} / 60</p>
            <p><strong>Section 2 (Grammar/Reading):</strong> {scaledSec2} / 60</p>
          </div>
          
          <div className="test-actions">
            <button className="test-btn primary" onClick={() => window.location.reload()}>New Exam</button>
            <button className="test-btn secondary" onClick={() => navigateTo('landing')}>Back to Menu</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="test-container">
      <div className="test-header">
        <button className="back-link" onClick={() => navigateTo('landing')}>← Quit Test</button>
        <span className="question-counter">
          Q {currentIndex + 1} of {examData.questions.length}
        </span>
      </div>

      <div className="section-indicator">
        {isSection1 ? "Section 1: Vocabulary" : "Section 2: Grammar & Reading"}
      </div>

      <div className="question-card">
        {currentQuestion.passage && <div className="passage-box">{currentQuestion.passage}</div>}
        <div className="category-badge">{currentQuestion.exam_type.replace('_', ' ').toUpperCase()}</div>
        <h2 className="question-text">{currentQuestion.question}</h2>

        <div className="options-grid">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = "option-btn";
            if (isAnswered) {
              if (option === currentQuestion.answer) buttonClass += " correct";
              else if (option === selectedOption) buttonClass += " incorrect";
              else buttonClass += " disabled";
            }
            return (
              <button key={index} className={buttonClass} onClick={() => handleOptionClick(option)} disabled={isAnswered}>
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <div className="feedback-section slide-up">
          <div className={`feedback-banner ${selectedOption === currentQuestion.answer ? 'success' : 'error'}`}>
            {selectedOption === currentQuestion.answer ? '✅ Correct!' : '❌ Incorrect!'}
          </div>
          {currentQuestion.explanation && <p className="explanation-text"><strong>Explanation:</strong> {currentQuestion.explanation}</p>}
          <button className="test-btn primary next-btn" onClick={handleNextQuestion}>
            {currentIndex === examData.questions.length - 1 ? 'View Final Score' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  );
}

export default MockTest;