import React, { useState, useEffect, useMemo } from 'react';
import TrackerHeader from './TrackerHeader';
import DateNavigation from './DateNavigation';
import MetricsTable from './MetricsTable';
import DailyScores from './DailyScores';
import Instructions from './Instructions';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatDateForInput, getSundayOfWeek, getWeekDates } from '../utils/dateUtils';
import { Metric, SleepData } from '../types';

const SleepTracker = () => {
  // View mode state (week, 2-week, month)
  const [viewMode, setViewMode] = useState('week');
  
  // State for dates and start date
  const [dates, setDates] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  
  // Sleep metrics to track (loaded from local storage if available)
  const [metrics, setMetrics] = useLocalStorage<Metric[]>('sleepMetrics', [
    { id: 'bedtime', name: 'Bedtime', config: { type: 'time', higherIsBetter: false } },
    { id: 'waketime', name: 'Wake Time', config: { type: 'time', higherIsBetter: true } },
    { id: 'totalSleep', name: 'Total Sleep', config: { type: 'time', higherIsBetter: true } },
    { id: 'avgSleepApple', name: '7 Day Avg Sleep (apple)', config: { type: 'time', higherIsBetter: true } },
    { id: 'ouraSleepScore', name: 'Oura Sleep Score', config: { type: 'score', higherIsBetter: true } },
    { id: 'ouraReadiness', name: 'Oura Readiness Score', config: { type: 'score', higherIsBetter: true } },
    { id: 'whoopRecovery', name: 'Whoop Recovery', config: { type: 'score', higherIsBetter: true } },
    { id: 'ouraActivity', name: 'Oura Activity Score', config: { type: 'score', higherIsBetter: true } },
    { id: 'naturalSleepRange', name: '"Natural Sleep Range"', config: { type: 'time', higherIsBetter: true } },
    { id: 'sleepConsistency', name: 'Sleep Consistency (whoop)', config: { type: 'score', higherIsBetter: true } },
  ]);
  
  // Data structure to store all sleep metrics (loaded from local storage if available)
  const [sleepData, setSleepData] = useLocalStorage<SleepData>('sleepData', {
    target: {
      bedtime_target: '22:00',
      bedtime_limit: '22:30',
      waketime_target: '06:30',
      waketime_limit: '07:00',
      totalSleep_target: '8:00',
      totalSleep_limit: '7:00'
    }
  });
  
  // Store cell colors (manually selected by user)
  const [cellColors, setCellColors] = useLocalStorage<Record<string, Record<string, string>>>('cellColors', {});
  
  // Calculate daily scores based on manually selected cell colors
  const dailyScores = useMemo(() => {
    const scores: Record<string, number | null> = {};
    
    dates.forEach(date => {
      // Skip if no data for this date
      if (!cellColors[date]) {
        scores[date] = null;
        return;
      }
      
      let redCells = 0;
      let yellowCells = 0;
      let greenCells = 0;
      let totalCells = 0;
      
      // Count cells of each color for this date
      for (const metricId in cellColors[date]) {
        const color = cellColors[date][metricId];
        totalCells++;
        
        if (color === 'format-error') {
          redCells++;
        } else if (color === 'format-warning') {
          yellowCells++;
        } else if (color === 'format-success') {
          greenCells++;
        }
      }
      
      // Calculate score: 1 - (red + yellow/2) / total
      if (totalCells > 0) {
        scores[date] = 1 - (redCells + yellowCells / 2) / totalCells;
      } else {
        scores[date] = null;
      }
    });
    
    return scores;
  }, [dates, cellColors]);
  
  // Update date range based on start date and view mode
  const updateDateRange = (start: string) => {
    let newDates: string[] = [];
    
    // For week view, adjust to show Sunday to Saturday
    if (viewMode === 'week') {
      const startDateObj = new Date(start + 'T12:00:00');
      const weekDates = getWeekDates(startDateObj);
      newDates = weekDates.map(date => formatDateForInput(date));
      
      // Update the start date to match the Sunday
      const sunday = getSundayOfWeek(startDateObj);
      setStartDate(formatDateForInput(sunday));
    } else {
      // For 2-week and month views, use the passed-in start date
      const startDateObj = new Date(start + 'T12:00:00');
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      
      // Determine number of days to show based on viewMode
      const daysToShow = viewMode === '2week' ? 14 : 30;
      
      // Generate dates starting from the provided start date
      for (let i = 0; i < daysToShow; i++) {
        const date = new Date(startDateObj);
        date.setDate(startDateObj.getDate() + i);
        date.setHours(12, 0, 0, 0);
        
        // Don't include dates after today
        if (date > today) break;
        
        newDates.push(formatDateForInput(date));
      }
      
      // If we have fewer dates than expected (because we hit today's date),
      // adjust the start date to show a full range ending at today
      if (newDates.length < daysToShow) {
        const adjustedStart = new Date(today);
        adjustedStart.setDate(today.getDate() - (daysToShow - 1));
        adjustedStart.setHours(12, 0, 0, 0);
        
        // Regenerate the dates
        newDates = [];
        for (let i = 0; i < daysToShow; i++) {
          const date = new Date(adjustedStart);
          date.setDate(adjustedStart.getDate() + i);
          date.setHours(12, 0, 0, 0);
          newDates.push(formatDateForInput(date));
        }
        
        // Update the start date to match the adjusted start
        setStartDate(formatDateForInput(adjustedStart));
      }
    }
    
    setDates(newDates);
  };
  
  // Handle color change for a cell
  const handleCellColorChange = (metricId: string, date: string, color: string) => {
    setCellColors(prev => {
      const newColors = { ...prev };
      if (!newColors[date]) {
        newColors[date] = {};
      }
      newColors[date][metricId] = color;
      return newColors;
    });
  };
  
  // Initialize dates array on component mount and when viewMode changes
  useEffect(() => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    
    if (viewMode === 'week') {
      const sunday = getSundayOfWeek(today);
      const initialStartDate = formatDateForInput(sunday);
      setStartDate(initialStartDate);
      updateDateRange(initialStartDate);
    } else {
      const formattedInitialStartDate = formatDateForInput(today);
      setStartDate(formattedInitialStartDate);
      updateDateRange(formattedInitialStartDate);
    }
  }, [viewMode]);
  
  // Add a new metric
  const addNewMetric = () => {
    const newId = `metric_${metrics.length + 1}`;
    setMetrics([...metrics, { 
      id: newId, 
      name: 'New Metric',
      config: { type: 'number', higherIsBetter: true }
    }]);
  };
  
  // Update a metric name
  const updateMetricName = (index: number, newName: string) => {
    const newMetrics = [...metrics];
    newMetrics[index].name = newName;
    setMetrics(newMetrics);
  };

  // Delete a metric
  const deleteMetric = (index: number) => {
    const newMetrics = metrics.filter((_, i) => i !== index);
    setMetrics(newMetrics);
  };
  
  // Handle input change from contentEditable divs
  const handleInputChange = (metricId: string, date: string, value: string) => {
    // If updating a target value
    if (date === 'target') {
      setSleepData(prev => ({
        ...prev,
        target: {
          ...prev.target,
          [metricId]: value
        }
      }));
      return;
    }
    
    // Create the date entry if it doesn't exist
    setSleepData(prev => {
      const newData = { ...prev };
      if (!newData[date]) {
        newData[date] = {};
      }
      
      newData[date] = {
        ...newData[date],
        [metricId]: value
      };
      
      return newData;
    });
  };
  
  // Reorder metrics when dragged
  const handleReorderMetrics = (newMetrics: Metric[]) => {
    setMetrics(newMetrics);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col max-w-screen-xl">
      <TrackerHeader />
      
      <div className="mb-8">
        <DateNavigation 
          viewMode={viewMode}
          setViewMode={setViewMode}
          dates={dates}
          startDate={startDate}
          setStartDate={setStartDate}
          updateDateRange={updateDateRange}
          addNewMetric={addNewMetric}
          sleepData={sleepData}
        />
      </div>
      
      <DailyScores scores={dailyScores} dates={dates} />
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Sleep Metrics</h2>
          <button 
            onClick={addNewMetric} 
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors duration-200"
          >
            Add Metric
          </button>
        </div>
        
        <MetricsTable 
          dates={dates}
          metrics={metrics}
          sleepData={sleepData}
          updateMetricName={updateMetricName}
          handleInputChange={handleInputChange}
          deleteMetric={deleteMetric}
          cellColors={cellColors}
          handleCellColorChange={handleCellColorChange}
          reorderMetrics={handleReorderMetrics}
        />
        
        <div className="text-sm text-gray-500">
          <p>* Double-click on any cell to edit its value.</p>
          <p>* Click once on a cell to change its color (useful for tracking good/neutral/bad values).</p>
          <p>* Use the up/down arrow buttons to reorder metrics.</p>
        </div>
      </div>
      
      <Instructions />
    </div>
  );
};

export default SleepTracker;