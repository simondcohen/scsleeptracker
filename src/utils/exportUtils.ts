import { SleepData } from '../types';

// Export data as CSV
export const exportCSV = (dates: string[], sleepData: SleepData) => {
  // Get all metric IDs from the data
  const metricIds = new Set<string>();
  const metricNames = new Map<string, string>();
  
  // Iterate through all dates to collect all used metrics
  Object.keys(sleepData)
    .filter(date => date !== 'target') // skip target metadata
    .forEach(date => {
      Object.keys(sleepData[date]).forEach(metricId => {
        metricIds.add(metricId);
      
      // Try to infer metric names from the data
      // This is a fallback in case we don't have the metrics list
      if (!metricNames.has(metricId)) {
        // Use a generic name if we can't infer it
        metricNames.set(metricId, metricId.charAt(0).toUpperCase() + metricId.slice(1).replace(/([A-Z])/g, ' $1'));
      }
    });
  });
  
  // Create CSV header row with dates
  let csv = 'Metric,' + dates.map(date => {
    const d = new Date(date);
    return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }).join(',') + '\n';
  
  // Add each metric row
  Array.from(metricIds).forEach(metricId => {
    let row = metricNames.get(metricId) || metricId;
    
    // Add values for each date
    dates.forEach(date => {
      const value = sleepData[date] && sleepData[date][metricId] !== undefined 
        ? sleepData[date][metricId] 
        : '';
      row += ',' + value;
    });
    
    csv += row + '\n';
  });
  
  // Create a blob and download link
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  
  // Create filename based on date range
  const lastDate = new Date(dates[dates.length-1]);
  const formattedLastDate = lastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedStartDate = new Date(dates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  a.download = `sleep_data_${formattedStartDate}_to_${formattedLastDate}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};