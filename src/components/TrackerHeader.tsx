import React from 'react';
import { Moon } from 'lucide-react';

const TrackerHeader = () => {
  return (
    <div className="flex items-center mb-8">
      <Moon className="w-8 h-8 text-indigo-500 mr-3" />
      <h1 className="text-3xl font-light text-gray-800">
        Sleep Tracker
      </h1>
      <div className="ml-auto text-sm text-gray-500">
        Track your sleep patterns for better insights
      </div>
    </div>
  );
};

export default TrackerHeader;