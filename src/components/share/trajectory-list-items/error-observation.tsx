import React from 'react';
import { CSyntaxHighlighter } from "../../syntax-highlighter";
import { TrajectoryCard } from "../trajectory-card";
import { ErrorObservation } from '../../../types/share';

interface ErrorObservationProps {
  observation: ErrorObservation;
}

export const ErrorObservationComponent: React.FC<ErrorObservationProps> = ({ observation }) => {
  return (
    <TrajectoryCard className="bg-red-100 dark:bg-red-900/20">
      <TrajectoryCard.Header className="bg-red-300 dark:bg-red-700">Error</TrajectoryCard.Header>
      <TrajectoryCard.Body>
        <CSyntaxHighlighter language="shell">{observation.content}</CSyntaxHighlighter>
      </TrajectoryCard.Body>
    </TrajectoryCard>
  );
};