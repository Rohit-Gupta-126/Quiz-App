'use client'
import React from 'react';

export default function AttemptHistory({ attempts = [], isVisible, onClose }) {
  if (!isVisible) return null;

  const attemptsArray = Array.isArray(attempts) ? attempts : [];

  // Sort attempts by date (newest first)
  const sortedAttempts = [...attemptsArray].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Quiz Attempt History</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {sortedAttempts.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No previous attempts found.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-center">Score</th>
                  <th className="py-2 px-4 text-center">Percentage</th>
                  <th className="py-2 px-4 text-right">Time Spent</th>
                </tr>
              </thead>
              <tbody>
                {sortedAttempts.map((attempt, index) => {
                  const date = new Date(attempt.date);
                  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);

                  return (
                    <tr key={attempt.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-3 px-4">
                        {date.toLocaleDateString()} {date.toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4 text-center font-medium">
                        {attempt.score}/{attempt.totalQuestions}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${percentage >= 80 ? 'bg-green-100 text-green-800' :
                          percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">{attempt.timeSpent} seconds</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};