'use client'
import React from 'react';

export default function StartScreen({ onStart, attemptsCount }) {
    return (
        <div className="text-center py-12 px-4">
            <h1 className="text-3xl font-bold mb-6">Welcome to the Quiz Challenge</h1>
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Quiz Instructions</h2>
                        <ul className="text-left text-sm space-y-2">
                            <li>• You'll answer 10 questions (5 multiple-choice, 5 numerical)</li>
                            <li>• You have 30 seconds to answer each question</li>
                            <li>• You'll receive immediate feedback after each answer</li>
                            <li>• Your final score and time will be recorded</li>
                        </ul>
                    </div>

                    {attemptsCount > 0 && (
                        <p className="mb-6 text-blue-600">
                            You've attempted this quiz {attemptsCount} time{attemptsCount !== 1 ? 's' : ''} before.
                        </p>
                    )}

                    <button
                        onClick={onStart}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Start Quiz
                    </button>
                </div>
            </div>
        </div>
    );
};