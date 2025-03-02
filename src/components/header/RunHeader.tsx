import React from 'react';
import { StatusChip } from '../status/StatusChip';

interface Issue {
  title: string;
  number: number;
}

interface ArtifactContent {
  issue?: Issue;
}

interface WorkflowRun {
  run_number: number;
  conclusion: string | null;
  status: string;
  head_branch: string;
  head_sha: string;
  html_url: string;
}

interface RunHeaderProps {
  run: WorkflowRun;
  artifactContent: ArtifactContent | null;
}

export const RunHeader: React.FC<RunHeaderProps> = ({ run, artifactContent }) => {
  return (
    <div className="flex flex-col gap-3 text-sm">
      {/* Issue title and number */}
      {artifactContent?.issue && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue</h3>
          <div className="flex items-baseline gap-2 bg-gray-50/50 dark:bg-gray-700/50 rounded px-2 py-1.5">
            <h1 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {artifactContent.issue.title}
            </h1>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0">
              #{artifactContent.issue.number}
            </span>
          </div>
        </div>
      )}
      
      {/* Run Status */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</h3>
        <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded px-2 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Run #{run.run_number}
            </span>
            <StatusChip
              label={run.conclusion || run.status}
              status={run.conclusion || run.status}
            />
          </div>
        </div>
      </div>

      {/* Git Info */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Git Info</h3>
        <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded px-2 py-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Branch:</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{run.head_branch}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Commit:</span>
                <span className="text-xs font-mono bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 rounded">{run.head_sha.substring(0, 7)}</span>
              </div>
            </div>
            <a
              href={run.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1"
              title="View on GitHub"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunHeader; 