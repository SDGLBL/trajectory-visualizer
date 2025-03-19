import React from 'react';
import { CSyntaxHighlighter } from "../../syntax-highlighter";
import { TrajectoryCard } from "../trajectory-card";
import { ReadAction } from '../../../types/share';

interface ReadActionProps {
  item: ReadAction;
}

export const ReadActionComponent: React.FC<ReadActionProps> = ({ item }) => {
  return (
    <TrajectoryCard className="bg-indigo-100 dark:bg-indigo-900/20">
      <TrajectoryCard.Header className="bg-indigo-300 dark:bg-indigo-700">Read File</TrajectoryCard.Header>
      <TrajectoryCard.Body>
        {item.args.thought && <div>{item.args.thought}</div>}
        <CSyntaxHighlighter language="shell">{`cat ${item.args.path}`}</CSyntaxHighlighter>
      </TrajectoryCard.Body>
    </TrajectoryCard>
  );
};