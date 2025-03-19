import React from 'react';
import { CSyntaxHighlighter } from "../../syntax-highlighter";
import { TrajectoryCard } from "../trajectory-card";
import { EditAction } from '../../../types/share';
import { CMarkdown } from '../../markdown';

interface EditActionProps {
  item: EditAction;
}

export const EditActionComponent: React.FC<EditActionProps> = ({ item }) => {
  return (
    <TrajectoryCard 
      className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800"
      originalJson={item}
    >
      <TrajectoryCard.Header className="bg-orange-100 dark:bg-orange-800/50 text-orange-800 dark:text-orange-100">Edit File</TrajectoryCard.Header>
      <TrajectoryCard.Body>
        {item.args.thought && <CMarkdown>{item.args.thought}</CMarkdown>}
        <div className="text-xs font-medium">File: {item.args.path}</div>
      </TrajectoryCard.Body>
    </TrajectoryCard>
  );
};