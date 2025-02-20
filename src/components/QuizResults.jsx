'use client'
import React from 'react';

export default function QuizResults({ score, totalQuestions, timeSpent, onRestartQuiz, answers, quizData }) {
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden my-8">
            <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Quiz Results</h2>

                <div className="flex flex-col sm:flex-row justify-around items-center mb-8 gap-4">
                    <div className="text-center">
                        <div className="text-5xl font-bold text-blue-600 mb-2">{score}/{totalQuestions}</div>
                        <div className="text-gray-500">Questions</div>
                    </div>

                    <div className="text-center">
                        <div className="text-5xl font-bold text-green-600 mb-2">{percentage}%</div>
                        <div className="text-gray-500">Accuracy</div>
                    </div>

                    <div className="text-center">
                        <div className="text-5xl font-bold text-purple-600 mb-2">{timeSpent}s</div>
                        <div className="text-gray-500">Time Spent</div>
                    </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">Question Summary</h3>
                <div className="space-y-3 mb-8">
                    {quizData.map((question, index) => {
                        const userAnswer = answers[index];
                        const isCorrect = question.type === 'multiple-choice'
                            ? userAnswer === question.answer
                            : parseInt(userAnswer) === question.answer;

                        return (
                            <div key={index} className="flex items-center border-b pb-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {isCorrect ? '✓' : '✗'}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Question {question.id}: {question.text.substring(0, 40)}...</p>
                                </div>
                                <div className="text-sm">
                                    {userAnswer ? (
                                        <span>
                                            Your answer: <strong>{userAnswer}</strong>
                                            {!isCorrect && (
                                                <span className="ml-2 text-gray-500">
                                                    (Correct: {question.answer})
                                                </span>
                                            )}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500">Not answered</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={onRestartQuiz}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Take Quiz Again
                    </button>
                </div>
            </div>
        </div>
    );
};