import React, { useState } from 'react';

export interface JsonlViewerSettingsProps {
  onSettingsChange: (settings: JsonlViewerSettings) => void;
  settings: JsonlViewerSettings;
}

export interface JsonlViewerSettings {
  sortField: string;
  sortDirection: 'asc' | 'desc';
  displayFields: string[];
}

const JsonlViewerSettings: React.FC<JsonlViewerSettingsProps> = ({ 
  onSettingsChange, 
  settings 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sortField, setSortField] = useState(settings.sortField);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(settings.sortDirection);
  const [displayFields, setDisplayFields] = useState<string[]>(settings.displayFields);
  const [newField, setNewField] = useState('');

  const handleSave = () => {
    onSettingsChange({
      sortField,
      sortDirection,
      displayFields
    });
    setIsOpen(false);
  };

  const handleAddField = () => {
    if (newField && !displayFields.includes(newField)) {
      setDisplayFields([...displayFields, newField]);
      setNewField('');
    }
  };

  const handleRemoveField = (field: string) => {
    setDisplayFields(displayFields.filter(f => f !== field));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddField();
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Settings
        {isOpen ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="mt-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
          <div className="space-y-4">
            {/* Sort Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort Entries</h3>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label htmlFor="sort-field" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Field (dot notation)
                  </label>
                  <input
                    id="sort-field"
                    type="text"
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    placeholder="e.g., metrics.accumulated_cost"
                    className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="sort-direction" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Direction
                  </label>
                  <select
                    id="sort-direction"
                    value={sortDirection}
                    onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
                    className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Display Fields */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Fields</h3>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newField}
                  onChange={(e) => setNewField(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., test_result.report.resolved"
                  className="flex-1 px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleAddField}
                  className="px-2 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Add
                </button>
              </div>
              
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {displayFields.length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    No display fields added. Default fields will be used.
                  </p>
                ) : (
                  displayFields.map((field, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-md">
                      <span className="text-xs text-gray-700 dark:text-gray-300">{field}</span>
                      <button
                        onClick={() => handleRemoveField(field)}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JsonlViewerSettings;