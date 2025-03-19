import React from 'react';
import { CSyntaxHighlighter } from "../../syntax-highlighter";
import { TrajectoryCard } from "../trajectory-card";
import { CommandAction } from '../../../types/share';

interface CommandActionProps {
  command: CommandAction;
}

export const CommandActionComponent: React.FC<CommandActionProps> = ({ command }) => {
  return (
    <TrajectoryCard className="bg-green-200 dark:bg-green-900/20">
      <TrajectoryCard.Header className="bg-green-400 dark:bg-green-700">Assistant Shell Action</TrajectoryCard.Header>
      <TrajectoryCard.Body>
        {command.args.thought}
        <CSyntaxHighlighter language="shell">{command.args.command}</CSyntaxHighlighter>
      </TrajectoryCard.Body>
    </TrajectoryCard>
  );
};