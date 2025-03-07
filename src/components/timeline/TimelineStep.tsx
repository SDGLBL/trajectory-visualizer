import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface TimelineEntry {
  type: string;
  content?: string;
  timestamp: string;
  is_input?: boolean;
  action?: string;
  command?: string;
  thought?: string;
  path?: string;
  metadata?: {
    cost?: number;
    tokens?: number;
    [key: string]: any;
  };
  actorType?: 'User' | 'Assistant' | 'System';
}

type StepColor = 'blue' | 'green' | 'purple' | 'yellow' | 'indigo';

interface TimelineStepProps {
  entry: TimelineEntry;
  index: number;
  isSelected: boolean;
  isLast: boolean;
  formatTimelineDate: (entry: TimelineEntry) => string;
  onSelect: (index: number) => void;
  onCommandClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFileEditClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const colorClasses: Record<StepColor, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  green: 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  purple: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800',
};

interface StepInfo {
  stepTitle: string;
  stepIcon: JSX.Element;
  actorType: 'User' | 'Assistant' | 'System';
  stepColor: StepColor;
}

const getStepInfo = (entry: TimelineEntry): StepInfo => {
  if (entry.is_input) {
    return {
      stepTitle: 'User Input',
      stepIcon: (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      actorType: entry.actorType || 'User',
      stepColor: 'purple',
    };
  }

  if (entry.action) {
    if (entry.action === 'run') {
      return {
        stepTitle: entry.action,
        stepIcon: (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        actorType: entry.actorType || 'Assistant',
        stepColor: 'green',
      };
    }

    if (entry.action === 'edit') {
      return {
        stepTitle: entry.action,
        stepIcon: (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
        actorType: entry.actorType || 'Assistant',
        stepColor: 'yellow',
      };
    }
  }

  if (entry.command) {
    return {
      stepTitle: 'Command',
      stepIcon: (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      actorType: entry.actorType || 'Assistant',
      stepColor: 'green',
    };
  }

  if (entry.thought) {
    return {
      stepTitle: 'Thought',
      stepIcon: (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      actorType: entry.actorType || 'Assistant',
      stepColor: 'indigo',
    };
  }

  return {
    stepTitle: 'Action',
    stepIcon: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    actorType: entry.actorType || 'Assistant',
    stepColor: 'blue',
  };
};

const MarkdownContent: React.FC<{ content: string; className?: string }> = memo(({ content, className = '' }) => (
  <div className={`prose prose-sm dark:prose-invert max-w-none prose-p:my-0.5 prose-headings:my-1 prose-ul:my-0.5 prose-ol:my-0.5 prose-pre:my-1 prose-pre:bg-gray-50 dark:prose-pre:bg-gray-800 prose-pre:rounded prose-pre:p-2 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:rounded prose-code:px-1 prose-code:font-mono ${className}`}>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  </div>
));

MarkdownContent.displayName = 'MarkdownContent';

const CommandBlock: React.FC<{ command: string; onCopy: (event: React.MouseEvent<HTMLButtonElement>) => void }> = memo(({ command, onCopy }) => (
  <div className="group relative">
    <pre className="text-[11px] font-mono text-green-500 bg-[#1E1E1E] dark:text-green-400 rounded overflow-x-auto leading-relaxed px-3 py-2">
      <span className="select-none text-gray-500 dark:text-gray-600 mr-2">$</span>{command}
    </pre>
    <button
      type="button"
      onClick={onCopy}
      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-800/50 text-gray-400"
    >
      <span className="sr-only">Copy command</span>
      📋
    </button>
  </div>
));

CommandBlock.displayName = 'CommandBlock';

const TimelineStep: React.FC<TimelineStepProps> = memo(({
  entry,
  index,
  isSelected,
  isLast,
  formatTimelineDate,
  onSelect,
  onCommandClick,
  onFileEditClick,
}) => {
  const { stepTitle, stepIcon, actorType, stepColor } = getStepInfo(entry);

  return (
    <div className="relative">
      {!isLast && (
        <div className="absolute left-[10px] top-8 bottom-0 w-[1px] bg-gradient-to-b from-gray-200/50 dark:from-gray-600/30 to-transparent" aria-hidden="true" />
      )}
      
      <div 
        className={`px-3 pt-1.5 pb-2.5 transition-colors duration-150 ${
          isSelected 
            ? 'bg-blue-50/50 dark:bg-blue-900/20 shadow-sm' 
            : 'hover:bg-gray-50/50 dark:hover:bg-gray-700/50'
        }`}
        onClick={() => onSelect(index)}
      >
        <div className="flex gap-3">
          {/* Icon */}
          <div className="flex-none">
            <div className={`w-5 h-5 flex items-center justify-center rounded-md ${colorClasses[stepColor]} shadow-sm ring-1 ring-black/5 dark:ring-white/5`}>
              {stepIcon}
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`inline-flex items-center h-[18px] px-1.5 rounded-md text-[10px] font-medium ${colorClasses[stepColor]} shadow-sm ring-1 ring-black/5 dark:ring-white/5`}>
                  {actorType}
                </span>
                <h4 className="text-xs font-medium text-gray-900 dark:text-white truncate">
                  {stepTitle}
                </h4>
                <time className="text-[10px] tabular-nums text-gray-400 dark:text-gray-500 font-medium">
                  {formatTimelineDate(entry)}
                </time>
              </div>
              {entry.metadata?.cost && (
                <span className="inline-flex items-center h-5 px-1.5 text-[10px] tabular-nums font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-md shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                  ${entry.metadata.cost.toFixed(5)}
                </span>
              )}
            </div>

            {/* Content sections */}
            <div className="space-y-1 mt-1.5">
              {entry.thought && (
                <div className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 rounded px-2 py-1">
                  <MarkdownContent content={entry.thought} />
                </div>
              )}
              {entry.content && (
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  <MarkdownContent content={entry.content} />
                </div>
              )}
              {entry.command && (
                <CommandBlock command={entry.command} onCopy={onCommandClick} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

TimelineStep.displayName = 'TimelineStep';

export default TimelineStep; 