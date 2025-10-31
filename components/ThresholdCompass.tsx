'use client';

import React from 'react';

interface ThresholdCompassProps {
  score: number;
}

export default function ThresholdCompass({ score }: ThresholdCompassProps) {
  const getColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getLabel = (score: number) => {
    if (score >= 80) return 'Ready to Buy';
    if (score >= 60) return 'Almost There';
    if (score >= 40) return 'Keep Building';
    return 'Not Yet Ready';
  };

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-48 h-48">
        <svg className="transform -rotate-90 w-48 h-48">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${getColor(score)} transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${getColor(score)}`}>
            {score}
          </span>
          <span className="text-sm text-gray-600 mt-1">HōMI Score</span>
        </div>
      </div>
      <p className={`mt-4 text-lg font-semibold ${getColor(score)}`}>
        {getLabel(score)}
      </p>
    </div>
  );
}
