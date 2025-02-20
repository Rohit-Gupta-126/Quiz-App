'use client'
import React from 'react';

export default function IntegerQuestion ({ question, userAnswer, onAnswerChange, feedback }) {
    const isCorrect = feedback && parseInt(userAnswer) === question.answer;
    const isIncorrect = feedback && userAnswer && parseInt(userAnswer) !== question.answer;

    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">{question.id}. {question.text}</h3>
            <div className="flex items-center space-x-2">
                <span>Answer:</span>
                <input
                    type="number"
                    value={userAnswer || ''}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    className={`border p-2 rounded-md w-40 ${isCorrect ? 'border-green-500 bg-green-50' :
                            isIncorrect ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                    disabled={feedback !== null}
                />
                {feedback && (
                    <div className="ml-4">
                        {isCorrect ? (
                            <span className="text-green-500">Correct! ✓</span>
                        ) : (
                            <span className="text-red-500">
                                Incorrect. The correct answer is {question.answer}.
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};