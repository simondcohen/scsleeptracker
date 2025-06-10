import React from 'react';
import { ArrowLeft, ArrowRight, Download } from 'lucide-react';
import { exportCSV } from '../utils/exportUtils';
import { formatDateForInput } from '../utils/dateUtils';
import { SleepData } from '../types';

interface DateNavigationProps {
  viewMode: string;
  setViewMode: (mode: string) => void;
  dates: string[];
  startDate: string;
  setStartDate: (date: string) => void;
  updateDateRange: (date: string) => void;
  addNewMetric: () => void;
  sleepData: SleepData;
}

const DateNavigation: React.FC<DateNavigationProps> = ({
  viewMode,
  setViewMode,
  dates,
  startDate,
  setStartDate,
  updateDateRange,
  addNewMetric,
  sleepData,
}) => {
  // Handle date range change
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    const today = formatDateForInput(new Date());
    const validDate = newStartDate > today ? today : newStartDate;

    setStartDate(validDate);
    updateDateRange(validDate);
  };
  
  // Number of days to shift based on the current view
  const periodLength = () => {
    if (viewMode === 'week') return 7;
    if (viewMode === '2week') return 14;
    return 30; // month
  };

  // Handle previous period
  const handlePrevPeriod = () => {
    const days = periodLength();
    const prevStart = new Date(startDate);
    prevStart.setDate(prevStart.getDate() - days);
    const newStartDate = formatDateForInput(prevStart);
    setStartDate(newStartDate);
    updateDateRange(newStartDate);
  };
  
  // Handle next period
  const handleNextPeriod = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = periodLength();
    const nextStart = new Date(startDate);
    nextStart.setDate(nextStart.getDate() + days);

    if (nextStart > today) {
      return; // Prevent navigating into the future
    }

    const newStartDate = formatDateForInput(nextStart);
    setStartDate(newStartDate);
    updateDateRange(newStartDate);
  };
  
  // Get the Sunday of the current week for display
  const getWeekStartDate = () => {
    if (dates.length > 0) {
      return dates[0]; // First date in the range (Sunday)
    }
    return startDate;
  };
  
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <button 
          onClick={handlePrevPeriod}
          className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200 border border-gray-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Previous
        </button>
        
        <div className="flex items-center">
          <span className="mr-3 text-gray-600">
            {viewMode === 'week' ? 'Week starting:' : 'Showing data through today'}
          </span>
          {viewMode === 'week' && (
            <input 
              type="date" 
              value={getWeekStartDate()}
              onChange={handleStartDateChange}
              className="border border-gray-300 rounded-md p-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow-sm"
            />
          )}
          {viewMode !== 'week' && (
            <span className="text-gray-600">
              ({viewMode === '2week' ? 'Past 2 weeks' : 'Past month'})
            </span>
          )}
        </div>
        
        <button 
          onClick={handleNextPeriod}
          className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200 border border-gray-200 shadow-sm"
        >
          Next <ArrowRight className="w-4 h-4 ml-1" />
        </button>
        
        {/* View mode selector */}
        <div className="flex items-center ml-auto md:ml-6 border border-gray-200 rounded-md overflow-hidden">
          <button
            onClick={() => {
              setViewMode('week');
              updateDateRange(startDate);
            }}
            className={`px-3 py-2 ${viewMode === 'week' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'bg-white'} transition-colors duration-200`}
          >
            Week
          </button>
          <button
            onClick={() => {
              setViewMode('2week');
              updateDateRange(startDate);
            }}
            className={`px-3 py-2 border-l border-r border-gray-200 ${viewMode === '2week' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'bg-white'} transition-colors duration-200`}
          >
            2 Weeks
          </button>
          <button
            onClick={() => {
              setViewMode('month');
              updateDateRange(startDate);
            }}
            className={`px-3 py-2 ${viewMode === 'month' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'bg-white'} transition-colors duration-200`}
          >
            Month
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={addNewMetric}
          className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors duration-200 border border-indigo-200 shadow-sm flex items-center"
        >
          <span className="text-xl mr-1">+</span> Add New Metric
        </button>
        
        <button
          onClick={() => exportCSV(dates, sleepData)}
          className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200 border border-gray-200 shadow-sm ml-auto"
        >
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </button>
      </div>
    </div>
  );
};

export default DateNavigation;