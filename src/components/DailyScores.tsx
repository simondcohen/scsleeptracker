import React from 'react';
import { formatDateForDisplay, isCurrentDay } from '../utils/dateUtils';

interface DailyScoresProps {
  dates: string[];
  scores: Record<string, number | null>;
}

const DailyScores: React.FC<DailyScoresProps> = ({ dates, scores }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Daily Scores</h3>
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[800px]">
          <div className="flex bg-white border border-gray-200 shadow-sm rounded-lg p-4">
            {dates.map((date) => {
              const score = scores[date];
              
              // Determine color based on score
              let scoreColor = "text-gray-400"; // Default/no data
              let bgColor = "bg-gray-50";
              
              if (score !== null) {
                if (score >= 0.8) {
                  scoreColor = "text-green-600";
                  bgColor = "bg-green-50";
                } else if (score >= 0.5) {
                  scoreColor = "text-yellow-600";
                  bgColor = "bg-yellow-50";
                } else {
                  scoreColor = "text-red-600";
                  bgColor = "bg-red-50";
                }
              }
              
              return (
                <div 
                  key={date} 
                  className={`flex-1 text-center px-2 py-3 mx-1 rounded-md ${
                    isCurrentDay(date) ? 'bg-indigo-50' : bgColor
                  }`}
                >
                  <div className="font-medium text-gray-600">
                    {formatDateForDisplay(date)}
                  </div>
                  <div className={`text-xl font-bold mt-1 ${scoreColor}`}>
                    {score !== null ? `${Math.round(score * 100)}%` : '-'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyScores; 