import React from 'react';
import MetricRow from './MetricRow';
import { formatDateForDisplay, isCurrentDay } from '../utils/dateUtils';
import { Metric } from '../types';

interface MetricsTableProps {
  dates: string[];
  metrics: Metric[];
  sleepData: any;
  updateMetricName: (index: number, newName: string) => void;
  handleInputChange: (metricId: string, date: string, value: string) => void;
  deleteMetric: (index: number) => void;
}

const MetricsTable: React.FC<MetricsTableProps> = ({
  dates,
  metrics,
  sleepData,
  updateMetricName,
  handleInputChange,
  deleteMetric,
}) => {
  // Get value for a specific metric and date
  const getValue = (metricId: string, date: string) => {
    if (date === 'target' && sleepData.target && sleepData.target[metricId]) {
      return sleepData.target[metricId];
    }
    if (sleepData[date] && sleepData[date][metricId] !== undefined) {
      return sleepData[date][metricId];
    }
    return '';
  };

  return (
    <div className="overflow-x-auto pb-4 mb-8">
      <div className="min-w-[800px]">
        <table className="w-full bg-white border border-gray-200 shadow-sm rounded-lg">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-6 sticky left-0 z-10 bg-gray-50 border-r-2 border-gray-200 text-left font-medium text-gray-600">
                Metric
              </th>
              <th className="py-3 px-6 border-r border-gray-200 text-center font-medium text-gray-600">
                Target
              </th>
              <th className="py-3 px-6 border-r-2 border-gray-200 text-center font-medium text-gray-600">
                Limit
              </th>
              {dates.map((date) => (
                <th
                  key={date}
                  className={`py-3 px-6 border-r border-gray-200 text-center font-medium ${
                    isCurrentDay(date) ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600'
                  }`}
                >
                  {formatDateForDisplay(date)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, index) => (
              <MetricRow
                key={metric.id}
                metric={metric}
                index={index}
                dates={dates}
                getValue={getValue}
                updateMetricName={updateMetricName}
                handleInputChange={handleInputChange}
                onDelete={deleteMetric}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetricsTable;