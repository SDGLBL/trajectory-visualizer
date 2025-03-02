import React from 'react';

export const RunDetailsSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Timeline and Artifact Content */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 overflow-hidden">
        {/* Timeline - full height with scrollable content */}
        <div className="flex-grow h-full lg:w-3/4 overflow-hidden">
          <div className="h-full flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            {/* Timeline Header - fixed */}
            <div className="flex-none h-10 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            
            {/* Timeline Content - scrollable */}
            <div className="flex-1 min-h-0 p-2 space-y-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
                  <div className="flex gap-3">
                    <div className="flex-none mt-1">
                      <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="flex gap-2">
                        <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-7 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Artifact Metadata - fixed height, no scroll */}
        <div className="flex-none lg:w-1/4 h-full max-h-full border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden flex flex-col">
          <div className="flex-none px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="flex-1 p-3 space-y-3">
            {/* Run Header skeleton */}
            <div className="space-y-2">
              <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
              
              <div className="mt-4 space-y-1.5">
                <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              
              <div className="mt-4 space-y-1.5">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunDetailsSkeleton; 