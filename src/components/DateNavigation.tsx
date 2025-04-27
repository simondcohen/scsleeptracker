import React from 'react';
import { ArrowLeft, ArrowRight, Download } from 'lucide-react';
import { exportCSV } from '../utils/exportUtils';
import { formatDateForInput } from '../utils/dateUtils';

interface DateNavigationProps {
  viewMode: string;
  setViewMode: (mode: string) => void;
  dates: string[];
  startDate: string;
  setStartDate: (date: string) => void;
  updateDateRange: (date: string) => void;
  addNewMetric: () => void;
  sleepData: any;
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
    setStartDate(newStartDate);
    updateDateRange(newStartDate);
  };
  
  // Handle previous period
  const handlePrevPeriod = () => {
    if (viewMode === 'week') {
      // For week view, go back 7 days
      const prevStart = new Date(startDate);
      prevStart.setDate(prevStart.getDate() - 7);
      const newStartDate = formatDateForInput(prevStart);
      setStartDate(newStartDate);
      updateDateRange(newStartDate);
    } else {
      // For 2-week and month views, move back by the appropriate number of days
      const daysToMove = viewMode === '2week' ? 7 : 15;
      
      // Get the first day currently shown
      const firstShownDate = new Date(dates[0]);
      
      // Calculate new start date by moving back from the first shown date
      const newStart = new Date(firstShownDate);
      newStart.setDate(newStart.getDate() - daysToMove);
      const newStartDate = formatDateForInput(newStart);
      
      setStartDate(newStartDate);
      updateDateRange(newStartDate);
    }
  };
  
  // Handle next period
  const handleNextPeriod = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    console.log('Current startDate:', startDate);
    
    if (viewMode === 'week') {
      // For week view, go forward 7 days if not going past today
      // Create date with noon to avoid timezone issues
      const nextStart = new Date(startDate + 'T12:00:00');
      nextStart.setDate(nextStart.getDate() + 7);
      nextStart.setHours(0, 0, 0, 0); // Reset hours for comparison
      
      console.log('Week view - Next dates:', {
        today: today.toISOString().split('T')[0],
        nextStart: nextStart.toISOString().split('T')[0],
        comparison: nextStart.getTime() <= today.getTime()
      });
      
      // Only move forward if next week's start date is not after today
      if (nextStart.getTime() <= today.getTime()) {
        const newStartDate = formatDateForInput(nextStart);
        setStartDate(newStartDate);
        updateDateRange(newStartDate);
      }
    } else {
      // For 2-week and month views
      const daysToMove = viewMode === '2week' ? 7 : 15;
      
      // Calculate the last day currently shown
      const lastShownDate = new Date(dates[dates.length - 1]);
      
      // Only move forward if we're not already showing today
      if (lastShownDate < today) {
        // Get the first date currently shown
        const firstShownDate = new Date(dates[0]);
        
        // Calculate new start date by moving forward from current first date
        const newStart = new Date(firstShownDate);
        newStart.setDate(newStart.getDate() + daysToMove);
        
        // Ensure we don't go past today for the end date
        const potentialEndDate = new Date(newStart);
        potentialEndDate.setDate(potentialEndDate.getDate() + (viewMode === '2week' ? 13 : 29));
        
        if (potentialEndDate > today) {
          // Adjust start date to ensure end date is today
          const adjustedStart = new Date(today);
          adjustedStart.setDate(today.getDate() - (viewMode === '2week' ? 13 : 29));
          setStartDate(formatDateForInput(adjustedStart));
          updateDateRange(formatDateForInput(adjustedStart));
        } else {
          // Use calculated start date
          setStartDate(formatDateForInput(newStart));
          updateDateRange(formatDateForInput(newStart));
        }
      }
    }
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