import React from 'react';
import { WorkflowRun } from '../../types';

interface WorkflowRunItemProps {
  run: WorkflowRun;
  isSelected: boolean;
  metadata: {
    title: string;
    issueNumber: number | null;
  };
  onSelect: (run: WorkflowRun) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success':
      return 'bg-green-500';
    case 'failure':
      return 'bg-red-500';
    case 'cancelled':
      return 'bg-orange-500';
    case 'in_progress':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const WorkflowRunItem: React.FC<WorkflowRunItemProps> = ({
  run,
  isSelected,
  metadata,
  onSelect,
}) => {
  return (
    <div
      id={`run-${run.id}`}
      className={`py-1 px-2 rounded-lg transition-all duration-200 cursor-pointer relative mb-3
        ${isSelected 
          ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500 ring-inset border-transparent shadow-sm' 
          : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
        } ${isSelected ? 'animate-highlight' : ''}`}
      onClick={() => {
        // Only trigger if not already selected
        if (!isSelected) {
          onSelect(run);
          window.dispatchEvent(new CustomEvent('workflowRunSelected', { detail: { runId: run.id } }));
        }
      }}
    >
      <div className="flex items-start gap-1.5">
        <div className="flex-shrink-0 pt-[2px]">
          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(run.conclusion || run.status)}`}></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <h3 className={`text-sm ${isSelected ? 'font-semibold' : 'font-medium'} text-gray-900 dark:text-white truncate`}>
              {metadata?.title || 'Loading...'}
            </h3>
            {metadata?.issueNumber && (
              <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                #{metadata.issueNumber}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Run #{run.run_number}
            </span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <time className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(run.created_at)}
            </time>
            {run.run_attempt > 1 && (
              <>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                  Attempt #{run.run_attempt}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 self-center">
          <svg className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WorkflowRunItem; 