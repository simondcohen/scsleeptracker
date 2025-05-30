import React, { useCallback } from 'react';
import MetricRow from './MetricRow';
import { formatDateForDisplay, isCurrentDay } from '../utils/dateUtils';
import { Metric, SleepData } from '../types';

interface MetricsTableProps {
  dates: string[];
  metrics: Metric[];
  sleepData: SleepData;
  dailyScores: Record<string, number | null>;
  updateMetricName: (index: number, newName: string) => void;
  handleInputChange: (metricId: string, date: string, value: string) => void;
  deleteMetric: (index: number) => void;
  cellColors: Record<string, Record<string, string>>;
  handleCellColorChange: (metricId: string, date: string, color: string) => void;
  reorderMetrics: (metrics: Metric[]) => void;
}

const MetricsTable: React.FC<MetricsTableProps> = ({
  dates,
  metrics,
  sleepData,
  dailyScores,
  updateMetricName,
  handleInputChange,
  deleteMetric,
  cellColors,
  handleCellColorChange,
  reorderMetrics,
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

  // Get color for a specific metric and date
  const getColor = (metricId: string, date: string) => {
    if (cellColors[date] && cellColors[date][metricId]) {
      return cellColors[date][metricId];
    }
    return '';
  };

  // Move row up
  const moveRowUp = useCallback(
    (index: number) => {
      if (index > 0) {
        const newMetrics = [...metrics];
        const temp = newMetrics[index];
        newMetrics[index] = newMetrics[index - 1];
        newMetrics[index - 1] = temp;
        reorderMetrics(newMetrics);
      }
    },
    [metrics, reorderMetrics]
  );

  // Move row down
  const moveRowDown = useCallback(
    (index: number) => {
      if (index < metrics.length - 1) {
        const newMetrics = [...metrics];
        const temp = newMetrics[index];
        newMetrics[index] = newMetrics[index + 1];
        newMetrics[index + 1] = temp;
        reorderMetrics(newMetrics);
      }
    },
    [metrics, reorderMetrics]
  );

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
            <tr className="bg-gray-50">
              <td className="py-3 px-6 sticky left-0 z-10 border-b border-r-2 border-gray-200 font-medium text-gray-600 bg-white">
                Daily Scores
              </td>
              <td className="border-b border-r border-gray-200 text-center">-</td>
              <td className="border-b border-r-2 border-gray-200 text-center">-</td>
              {dates.map((date) => {
                const score = dailyScores[date];
                let bgColor = 'bg-gray-50';
                if (score !== null) {
                  if (score >= 0.8) {
                    bgColor = 'bg-green-50';
                  } else if (score >= 0.5) {
                    bgColor = 'bg-yellow-50';
                  } else {
                    bgColor = 'bg-red-50';
                  }
                }
                return (
                  <td
                    key={date}
                    className={`border-b border-r border-gray-200 text-center ${
                      isCurrentDay(date) ? 'bg-indigo-50' : bgColor
                    }`}
                  >
                    {score !== null ? `${Math.round(score * 100)}%` : '-'}
                  </td>
                );
              })}
            </tr>
            {metrics.map((metric, index) => (
              <MetricRow
                key={metric.id}
                metric={metric}
                index={index}
                dates={dates}
                getValue={getValue}
                getColor={getColor}
                updateMetricName={updateMetricName}
                handleInputChange={handleInputChange}
                onDelete={deleteMetric}
                onColorChange={handleCellColorChange}
                moveRowUp={moveRowUp}
                moveRowDown={moveRowDown}
                isFirstRow={index === 0}
                isLastRow={index === metrics.length - 1}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetricsTable;