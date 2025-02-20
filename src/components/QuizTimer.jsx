'use client'
import React from 'react';

export default function QuizTimer({ seconds }) {
    const percentage = (seconds / 30) * 100;

    return (
        <div className="w-full mb-6">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Time Remaining</span>
                <span className="text-sm font-medium">{seconds} seconds</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%`, backgroundColor: percentage < 20 ? 'red' : '' }}
                ></div>
            </div>
        </div>
    );
};