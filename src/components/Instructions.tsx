import React from 'react';
import { Info, Calendar, Edit2, RefreshCw, Save, Clock } from 'lucide-react';

const Instructions = () => {
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm mt-8">
      <div className="flex items-center mb-4">
        <Info className="w-5 h-5 text-indigo-500 mr-2" />
        <h2 className="text-lg font-medium text-gray-800">How to use the Sleep Tracker</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex">
          <Calendar className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-700 mb-1">Navigate between date ranges</p>
            <p className="text-gray-600 text-sm">Use the Previous/Next buttons or select a specific start date in Week view</p>
          </div>
        </div>
        
        <div className="flex">
          <Edit2 className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-700 mb-1">Enter sleep data</p>
            <p className="text-gray-600 text-sm">Click on any cell in the table to record your sleep metrics</p>
          </div>
        </div>
        
        <div className="flex">
          <Clock className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-700 mb-1">Customize metrics</p>
            <p className="text-gray-600 text-sm">Edit metric names by clicking on them or add new ones with the + button</p>
          </div>
        </div>
        
        <div className="flex">
          <RefreshCw className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-700 mb-1">Change time periods</p>
            <p className="text-gray-600 text-sm">Switch between Week, 2-Week, and Month views using the toggle buttons</p>
          </div>
        </div>
        
        <div className="flex">
          <Save className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-700 mb-1">Export your data</p>
            <p className="text-gray-600 text-sm">Download your sleep data as a CSV file for analysis or backup</p>
          </div>
        </div>
        
        <div className="flex">
          <Info className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-700 mb-1">Data persistence</p>
            <p className="text-gray-600 text-sm">Your data is automatically saved in your browser's local storage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;