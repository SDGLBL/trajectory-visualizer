import React from 'react';
import { CSyntaxHighlighter } from "../../syntax-highlighter";
import { TrajectoryCard } from "../trajectory-card";
import { EditAction } from '../../../types/share';

interface EditActionProps {
  item: EditAction;
}

export const EditActionComponent: React.FC<EditActionProps> = ({ item }) => {
  return (
    <TrajectoryCard className="bg-orange-100 dark:bg-orange-900/20">
      <TrajectoryCard.Header className="bg-orange-300 dark:bg-orange-700">Edit File</TrajectoryCard.Header>
      <TrajectoryCard.Body>
        {item.args.thought && <div>{item.args.thought}</div>}
        <div className="text-sm font-medium">File: {item.args.path}</div>
      </TrajectoryCard.Body>
    </TrajectoryCard>
  );
};