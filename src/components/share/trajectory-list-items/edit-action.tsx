import React, { useState } from 'react';
import { TrajectoryCard } from "../trajectory-card";
import { EditAction } from '../../../types/share';
import { CMarkdown } from '../../markdown';
import { DiffViewer } from '../../diff-viewer';

interface EditActionProps {
  item: EditAction;
}

export const EditActionComponent: React.FC<EditActionProps> = ({ item }) => {
  const [showDiff, setShowDiff] = useState(true);
  
  // Determine language based on file extension
  const getLanguage = (path: string) => {
    const extension = path.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'py':
        return 'python';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'sh':
        return 'bash';
      default:
        return 'text';
    }
  };

  const language = getLanguage(item.args.path);

  return (
    <TrajectoryCard 
      className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800"
      originalJson={item}
    >
      <TrajectoryCard.Header className="bg-orange-100 dark:bg-orange-800/50 text-orange-800 dark:text-orange-100">
        <div className="flex justify-between items-center w-full">
          <span>File Edit Action: {item.args.path}</span>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowDiff(!showDiff)} 
              className="text-xs px-2 py-1 rounded bg-orange-200 dark:bg-orange-700 text-orange-800 dark:text-orange-100 hover:bg-orange-300 dark:hover:bg-orange-600 transition-colors"
            >
              {showDiff ? 'Hide Diff' : 'Show Diff'}
            </button>
          </div>
        </div>
      </TrajectoryCard.Header>
      <TrajectoryCard.Body>
        {item.args.thought && (
          <div className="mb-3">
            <div className="text-xs font-medium mb-1">Thought:</div>
            <CMarkdown>{item.args.thought}</CMarkdown>
          </div>
        )}
        
        {showDiff && (
          <div className="mt-3">
            <div className="text-xs font-medium mb-1">Changes:</div>
            <div className="border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
              <DiffViewer 
                oldStr={item.args.old_content || ''} 
                newStr={item.args.new_content || ''} 
                language={language}
              />
            </div>
          </div>
        )}
      </TrajectoryCard.Body>
    </TrajectoryCard>
  );
};