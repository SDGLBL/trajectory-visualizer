import React from 'react';
import { TrajectoryCard } from "../trajectory-card";
import { UserMessage } from '../../../types/share';

interface UserMessageProps {
  message: UserMessage;
}

export const UserMessageComponent: React.FC<UserMessageProps> = ({ message }) => {
  const content = message.content || message.args?.content || '';
  
  return (
    <TrajectoryCard className="bg-blue-100 dark:bg-blue-900/20">
      <TrajectoryCard.Header className="bg-blue-300 dark:bg-blue-700">User Message</TrajectoryCard.Header>
      <TrajectoryCard.Body>
        {content}
      </TrajectoryCard.Body>
    </TrajectoryCard>
  );
};