import React from 'react';
import { TrajectoryCard } from "../trajectory-card";
import { CSyntaxHighlighter } from '../../syntax-highlighter';
import { QueryCodeIndexAction } from '../../../types/share';

interface QueryCodeIndexActionProps {
  action: QueryCodeIndexAction;
}

export const QueryCodeIndexActionComponent: React.FC<QueryCodeIndexActionProps> = ({ action }) => {
  return (
    <TrajectoryCard 
      className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800"
      originalJson={action}
    >
      <TrajectoryCard.Header className="bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-100">Code Index Query</TrajectoryCard.Header>
      <TrajectoryCard.Body>
        <div className="mb-2 font-medium">{action.message}</div>
        <div className="text-sm mb-2">
          <span className="font-semibold">Method:</span> {action.args.method}
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded overflow-auto">
          <CSyntaxHighlighter language="json">
            {JSON.stringify(action.args.params, null, 2)}
          </CSyntaxHighlighter>
        </div>
      </TrajectoryCard.Body>
    </TrajectoryCard>
  );
};