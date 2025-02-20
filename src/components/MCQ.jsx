'use client'
import React from 'react';
import { useState, useEffect } from 'react';

export default function MCQ({ question, selectedAnswer, onAnswerSelect, onSkip, feedback }) {
    const options = ['A', 'B', 'C', 'D'];
    const [localAnswer, setLocalAnswer] = useState(selectedAnswer);

    useEffect(() => {
        setLocalAnswer(null);
    }, [question]);

    const handleOptionClick = (option) => {
        if (feedback) return;
        setLocalAnswer(option);
    };

    const handleSubmit = () => {
        if (localAnswer && !feedback) {
            onAnswerSelect(localAnswer);
        }
    };

    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">{question.id}. {question.text}</h3>
            <div className="space-y-3">
                {question.options.map((option, index) => (
                    <div
                        key={index}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${(localAnswer === options[index] || selectedAnswer === options[index])
                            ? (feedback
                                ? (options[index] === question.answer ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500')
                                : 'bg-blue-100 border-blue-500')
                            : 'hover:bg-gray-50'
                            }`}
                        onClick={() => handleOptionClick(options[index])}
                    >
                        <div className="flex items-center">
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-medium mr-3">
                                {options[index]}
                            </span>
                            <span>{option}</span>
                            {feedback && options[index] === question.answer && (
                                <span className="ml-auto text-green-500">✓</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {!feedback && (
                <div className="mt-6 flex space-x-4">
                    <button
                        onClick={handleSubmit}
                        disabled={!localAnswer}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors ${!localAnswer ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                            }`}
                    >
                        Submit Answer
                    </button>
                    <button
                        onClick={onSkip}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Skip Question
                    </button>
                </div>
            )}
        </div>
    );
}