import React from 'react';
import { CSyntaxHighlighter } from "../../syntax-highlighter";
import { TrajectoryCard } from "../trajectory-card";
import { CommandObservation } from '../../../types/share';

interface CommandObservationProps {
  observation: CommandObservation;
}

export const CommandObservationComponent: React.FC<CommandObservationProps> = ({ observation }) => {
  return (
    <TrajectoryCard className="bg-gray-100 dark:bg-gray-800/50">
      <TrajectoryCard.Header className="bg-gray-300 dark:bg-gray-700">Shell Output</TrajectoryCard.Header>
      <TrajectoryCard.Body>
        <CSyntaxHighlighter language="shell">{observation.content}</CSyntaxHighlighter>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Exit code: {observation.extras.exit_code}
        </div>
      </TrajectoryCard.Body>
    </TrajectoryCard>
  );
};