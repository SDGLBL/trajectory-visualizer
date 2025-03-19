import React from 'react';
import { CSyntaxHighlighter } from "../../syntax-highlighter";
import { TrajectoryCard } from "../trajectory-card";
import { IPythonAction } from '../../../types/share';

interface IPythonActionProps {
  action: IPythonAction;
}

export const IPythonActionComponent: React.FC<IPythonActionProps> = ({ action }) => {
  return (
    <TrajectoryCard className="bg-yellow-100 dark:bg-yellow-900/20">
      <TrajectoryCard.Header className="bg-yellow-300 dark:bg-yellow-700">IPython Action</TrajectoryCard.Header>
      <TrajectoryCard.Body>
        {action.args.thought}
        <CSyntaxHighlighter language="python">{action.args.code}</CSyntaxHighlighter>
      </TrajectoryCard.Body>
    </TrajectoryCard>
  );
};