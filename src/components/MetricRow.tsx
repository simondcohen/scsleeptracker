import React, { useState } from 'react';
import { isCurrentDay } from '../utils/dateUtils';
import { Metric } from '../types';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface MetricRowProps {
  metric: Metric;
  index: number;
  dates: string[];
  getValue: (metricId: string, date: string) => string;
  getColor: (metricId: string, date: string) => string;
  updateMetricName: (index: number, newName: string) => void;
  handleInputChange: (metricId: string, date: string, value: string) => void;
  onDelete: (index: number) => void;
  onColorChange: (metricId: string, date: string, color: string) => void;
  moveRowUp: (index: number) => void;
  moveRowDown: (index: number) => void;
  isFirstRow: boolean;
  isLastRow: boolean;
}

const MetricRow: React.FC<MetricRowProps> = ({
  metric,
  index,
  dates,
  getValue,
  getColor,
  updateMetricName,
  handleInputChange,
  onDelete,
  onColorChange,
  moveRowUp,
  moveRowDown,
  isFirstRow,
  isLastRow,
}) => {
  const target = getValue(`${metric.id}_target`, 'target') || '';
  const limit = getValue(`${metric.id}_limit`, 'target') || '';
  const [showDelete, setShowDelete] = useState(false);

  // Function to cycle through colors
  const cycleColor = (metricId: string, date: string) => {
    const colors = ['', 'format-success', 'format-warning', 'format-error'];
    const currentColor = getColor(metricId, date) || '';
    const currentIndex = colors.indexOf(currentColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    onColorChange(metricId, date, colors[nextIndex]);
  };

  // Handle key press for saving on Enter
  const handleKeyPress = (
    e: React.KeyboardEvent,
    saveCallback: (value: string) => void
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = e.currentTarget as HTMLDivElement;
      target.contentEditable = 'false';
      saveCallback(target.textContent || '');
      target.blur();
    }
  };

  return (
    <tr 
      className={`${index % 2 === 0 ? 'bg-gray-50' : ''}`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <td className="py-3 px-6 sticky left-0 z-10 border-b border-r-2 border-gray-200 font-medium text-gray-600 bg-white">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <button 
              onClick={() => moveRowUp(index)}
              disabled={isFirstRow}
              className={`p-1 text-gray-400 hover:text-gray-600 ${isFirstRow ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
              title="Move up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button 
              onClick={() => moveRowDown(index)}
              disabled={isLastRow}
              className={`p-1 text-gray-400 hover:text-gray-600 ${isLastRow ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
              title="Move down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div
            contentEditable={false}
            suppressContentEditableWarning={true}
            onBlur={(e) => {
              e.currentTarget.contentEditable = 'false';
              updateMetricName(index, e.currentTarget.textContent || '');
            }}
            onKeyDown={(e) => handleKeyPress(e, (value) => updateMetricName(index, value))}
            onDoubleClick={(e) => {
              e.currentTarget.contentEditable = 'true';
              e.currentTarget.focus();
            }}
            className="outline-none px-2 py-1 rounded hover:bg-gray-100 w-fit"
          >
            {metric.name}
          </div>
          {showDelete && (
            <button
              onClick={() => onDelete(index)}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
              title="Delete metric"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
      <td className="border-b border-r border-gray-200 text-center">
        <div
          contentEditable={false}
          suppressContentEditableWarning={true}
          onBlur={(e) => {
            e.currentTarget.contentEditable = 'false';
            handleInputChange(`${metric.id}_target`, 'target', e.currentTarget.textContent || '');
          }}
          onKeyDown={(e) => handleKeyPress(e, (value) => 
            handleInputChange(`${metric.id}_target`, 'target', value)
          )}
          onDoubleClick={(e) => {
            e.currentTarget.contentEditable = 'true';
            e.currentTarget.focus();
          }}
          className="min-h-6 outline-none px-2 py-1 mx-auto w-20"
        >
          {target}
        </div>
      </td>
      <td className="border-b border-r-2 border-gray-200 text-center">
        <div
          contentEditable={false}
          suppressContentEditableWarning={true}
          onBlur={(e) => {
            e.currentTarget.contentEditable = 'false';
            handleInputChange(`${metric.id}_limit`, 'target', e.currentTarget.textContent || '');
          }}
          onKeyDown={(e) => handleKeyPress(e, (value) => 
            handleInputChange(`${metric.id}_limit`, 'target', value)
          )}
          onDoubleClick={(e) => {
            e.currentTarget.contentEditable = 'true';
            e.currentTarget.focus();
          }}
          className="min-h-6 outline-none px-2 py-1 mx-auto w-20"
        >
          {limit}
        </div>
      </td>
      {dates.map((date) => {
        const value = getValue(metric.id, date);
        const cellColor = getColor(metric.id, date);
        
        return (
          <td
            key={date}
            onClick={() => cycleColor(metric.id, date)}
            className={`border-b border-r border-gray-200 text-center cursor-pointer ${cellColor} ${
              isCurrentDay(date) ? 'bg-indigo-50' : ''
            }`}
          >
            <div
              contentEditable={false}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                e.currentTarget.contentEditable = 'false';
                handleInputChange(metric.id, date, e.currentTarget.textContent || '');
              }}
              onKeyDown={(e) => handleKeyPress(e, (value) => 
                handleInputChange(metric.id, date, value)
              )}
              onDoubleClick={(e) => {
                e.stopPropagation();
                e.currentTarget.contentEditable = 'true';
                e.currentTarget.focus();
              }}
              onClick={(e) => e.stopPropagation()}
              className="min-h-6 outline-none px-2 py-1 mx-auto w-20"
            >
              {value}
            </div>
          </td>
        );
      })}
    </tr>
  );
};

export default MetricRow;