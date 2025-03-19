import React from 'react';
import { CSyntaxHighlighter } from "../../syntax-highlighter";
import { TrajectoryCard } from "../trajectory-card";
import { FinishAction } from '../../../types/share';

interface FinishActionProps {
  action: FinishAction;
}

export const FinishActionComponent: React.FC<FinishActionProps> = ({ action }) => {
  return (
    <TrajectoryCard className="bg-green-100 dark:bg-green-900/20">
      <TrajectoryCard.Header className="bg-green-300 dark:bg-green-700">Finish</TrajectoryCard.Header>
      <TrajectoryCard.Body>
        {action.args.thought}
        {Object.keys(action.args.outputs).length > 0 && (
          <CSyntaxHighlighter language="json">
            {JSON.stringify(action.args.outputs, null, 2)}
          </CSyntaxHighlighter>
        )}
      </TrajectoryCard.Body>
    </TrajectoryCard>
  );
};