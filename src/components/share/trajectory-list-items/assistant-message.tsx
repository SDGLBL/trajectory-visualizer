import React from 'react';
import { TrajectoryCard } from "../trajectory-card";
import { AssistantMessage } from '../../../types/share';

interface AssistantMessageProps {
  message: AssistantMessage;
}

export const AssistantMessageComponent: React.FC<AssistantMessageProps> = ({ message }) => {
  const content = message.content || message.args?.content || '';
  
  return (
    <TrajectoryCard className="bg-purple-100 dark:bg-purple-900/20">
      <TrajectoryCard.Header className="bg-purple-300 dark:bg-purple-700">Assistant Message</TrajectoryCard.Header>
      <TrajectoryCard.Body>
        {content}
      </TrajectoryCard.Body>
    </TrajectoryCard>
  );
};