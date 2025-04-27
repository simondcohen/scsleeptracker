import React, { useState, useEffect } from 'react';
import TrackerHeader from './TrackerHeader';
import DateNavigation from './DateNavigation';
import MetricsTable from './MetricsTable';
import Instructions from './Instructions';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatDateForInput, getSundayOfWeek, getWeekDates } from '../utils/dateUtils';
import { Metric } from '../types';

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
  const [sleepData, setSleepData] = useLocalStorage('sleepData', {
    target: {
      bedtime_target: '22:00',
      bedtime_limit: '22:30',
      waketime_target: '06:30',
      waketime_limit: '07:00',
      totalSleep_target: '8:00',
      totalSleep_limit: '7:00'
    }
  });
  
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
      // For 2-week and month views, ALWAYS end with today's date
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      
      // Determine number of days to show based on viewMode
      const daysToShow = viewMode === '2week' ? 14 : 30;
      
      // Calculate the start date by going back (daysToShow - 1) days from today
      for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        date.setHours(12, 0, 0, 0);
        newDates.push(formatDateForInput(date));
      }
    }
    
    setDates(newDates);
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
    setSleepData((prevData: any) => {
      // Deep clone the previous data
      const newData = JSON.parse(JSON.stringify(prevData));
      
      if (date === 'target') {
        if (!newData.target) {
          newData.target = {};
        }
        newData.target[metricId] = value;
      } else {
        // Initialize the date object if it doesn't exist
        if (!newData[date]) {
          newData[date] = {};
        }
        // Set the new value
        newData[date][metricId] = value;
      }
      
      return newData;
    });
  };
  
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <TrackerHeader />
      
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
      
      <MetricsTable 
        dates={dates}
        metrics={metrics}
        sleepData={sleepData}
        updateMetricName={updateMetricName}
        handleInputChange={handleInputChange}
        deleteMetric={deleteMetric}
      />
      
      <Instructions />
    </div>
  );
};

export default SleepTracker;