import React from 'react';
import { CSyntaxHighlighter } from "../../syntax-highlighter";
import { TrajectoryCard } from "../trajectory-card";
import { FinishAction } from '../../../types/share';
import { CMarkdown } from '../../markdown';

interface FinishActionProps {
  action: FinishAction;
}

export const FinishActionComponent: React.FC<FinishActionProps> = ({ action }) => {
  return (
    <TrajectoryCard className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
      <TrajectoryCard.Header className="bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-100">Finish</TrajectoryCard.Header>
      <TrajectoryCard.Body>
        {action.args.thought && <CMarkdown>{action.args.thought}</CMarkdown>}
        {Object.keys(action.args.outputs).length > 0 && (
          <CSyntaxHighlighter language="json">
            {JSON.stringify(action.args.outputs, null, 2)}
          </CSyntaxHighlighter>
        )}
      </TrajectoryCard.Body>
    </TrajectoryCard>
  );
};