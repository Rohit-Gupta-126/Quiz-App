'use client'
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { quizData } from '../data/quizData';
import { getAttempts, saveAttempt } from '../services/dbService';
import QuizTimer from './QuizTimer';
import MCQ from './MCQ';
import IntegerQuestion from './IntegerQuestion';
import QuizResults from './QuizResults';
import StartScreen from './StartScreen';
import AttemptHistory from './AttemptHistory';

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(quizData.length).fill(null));
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // Load attempts on component mount
  useEffect(() => {
    const loadAttempts = async () => {
      try {
        const savedAttempts = await getAttempts();
        setAttempts(savedAttempts || []);
      } catch (error) {
        console.error("Error loading attempts:", error);
      }
    };
    loadAttempts();
  }, []);

  // Timer effect: start timer when quiz is active and no feedback is shown
  useEffect(() => {
    if (quizStarted && !quizFinished && !feedback) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }
      // Start timer only if there isn't an active interval already.
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setTimer(prev => {
            if (prev <= 1) {
              // Time's up for current question
              handleTimeUp();
              return 30;
            }
            return prev - 1;
          });
          // Update total time spent
          setTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 1000);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [quizStarted, quizFinished, currentQuestion, feedback]);

  const handleTimeUp = () => {
    if (quizFinished) {
      console.log("⚠️ Time ran out but quiz was already finished. Skipping.");
      return;
    }
    console.log("⏳ Time's up for question.");
    // If no answer selected (i.e. no feedback) simply skip to next question
    if (!feedback) {
      if (currentQuestion < quizData.length - 1) {
        console.log("➡️ Skipping to next question.");
        setCurrentQuestion(prev => prev + 1);
        setFeedback(null);
        setTimer(30);
      } else {
        console.log("🚀 Time ran out on last question, calling finishQuiz()");
        finishQuiz();
      }
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setQuizFinished(false);
    setCurrentQuestion(0);
    setAnswers(Array(quizData.length).fill(null));
    setScore(0);
    setTimer(30);
    setFeedback(null);
    setTimeSpent(0);
    startTimeRef.current = Date.now();
  };

  const handleAnswerSelect = (answer) => {
    if (feedback) return; // Prevent re-answering once feedback is shown

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    // Check answer correctness
    const currentQuestionData = quizData[currentQuestion];
    const isCorrect = answer === currentQuestionData.answer;
    setFeedback(isCorrect);
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Clear the interval so timer stops during feedback
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // After a short delay, move to next question or finish quiz
    setTimeout(() => {
      if (currentQuestion < quizData.length - 1) {
        console.log("➡️ Moving to next question.");
        setCurrentQuestion(prev => prev + 1);
        setFeedback(null);
        setTimer(30);
      } else {
        console.log("🚀 Last question answered, attempting to call finishQuiz()...");
        setTimeout(() => {
          if (!quizFinished) {
            console.log("✅ Calling finishQuiz() after last question is processed.");
            finishQuiz();
          } else {
            console.log("⚠️ Duplicate finishQuiz() call skipped.");
          }
        }, 1000);
      }
    }, 1000);
  };

  const handleIntegerAnswerChange = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleIntegerAnswerSubmit = () => {
    if (feedback) return;
    const answer = answers[currentQuestion];
    if (!answer) return; // Do nothing if no answer provided

    const currentQuestionData = quizData[currentQuestion];
    const isCorrect = parseInt(answer) === currentQuestionData.answer;
    setFeedback(isCorrect);
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setTimeout(() => {
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setFeedback(null);
        setTimer(30);
      } else {
        finishQuiz();
      }
    }, 1000);
  };

  const handleSkipQuestion = () => {
    // Clear any active timer during skip
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (currentQuestion < quizData.length - 1) {
      console.log("➡️ Skipping to next question.");
      setCurrentQuestion(prev => prev + 1);
      setFeedback(null);
      setTimer(30);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    if (quizFinished) {
      console.log("⚠️ finishQuiz() already ran, skipping...");
      return;
    }
    console.log("✅ Running finishQuiz()...");
    setQuizFinished(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const totalTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setTimeSpent(totalTime);

    try {
      const attempt = {
        id: uuidv4(),
        date: new Date(),
        score,
        totalQuestions: quizData.length,
        timeSpent: totalTime,
        answers: [...answers]
      };
      saveAttempt(attempt);
    } catch (error) {
      console.error("Error saving attempt:", error);
    }
  };

  // Render current question based on its type
  const renderCurrentQuestion = () => {
    const question = quizData[currentQuestion];
    if (question.type === 'multiple-choice') {
      return (
        <MCQ
          question={question}
          selectedAnswer={answers[currentQuestion]}
          onAnswerSelect={handleAnswerSelect}
          feedback={feedback}
          onSkip={handleSkipQuestion}
        />
      );
    } else if (question.type === 'integer') {
      return (
        <div>
          <IntegerQuestion
            question={question}
            userAnswer={answers[currentQuestion]}
            onAnswerChange={handleIntegerAnswerChange}
            feedback={feedback}
            onSkip={handleSkipQuestion}
          />
          {!feedback && (
            <div className="mt-4">
              <button
                onClick={handleIntegerAnswerSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
                disabled={!answers[currentQuestion]}
              >
                Submit Answer
              </button>
              <button
                onClick={handleSkipQuestion}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Skip Question
              </button>
            </div>
          )}
        </div>
      );
    }
  };

  if (!quizStarted) {
    return (
      <div>
        <StartScreen onStart={handleStartQuiz} attemptsCount={attempts.length} />
        {attempts.length > 0 && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowHistory(true)}
              className="text-blue-600 hover:underline"
            >
              View Previous Attempts
            </button>
          </div>
        )}
        <AttemptHistory
          attempts={attempts}
          isVisible={showHistory}
          onClose={() => setShowHistory(false)}
        />
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div>
        <QuizResults
          score={score}
          totalQuestions={quizData.length}
          timeSpent={timeSpent}
          onRestartQuiz={handleStartQuiz}
          answers={answers}
          quizData={quizData}
        />
        <div className="text-center mb-8">
          <button
            onClick={() => setShowHistory(true)}
            className="text-blue-600 hover:underline"
          >
            View All Attempts
          </button>
        </div>
        <AttemptHistory
          attempts={attempts}
          isVisible={showHistory}
          onClose={() => setShowHistory(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden my-8 p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">
          Question {currentQuestion + 1} of {quizData.length}
        </h2>
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">
            Score: {score}/{currentQuestion}
          </div>
        </div>
      </div>
      <QuizTimer seconds={timer} />
      {renderCurrentQuestion()}
    </div>
  );
}
