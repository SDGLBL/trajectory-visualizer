import React from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';

interface DiffViewerProps {
  oldStr: string;
  newStr: string;
  language?: string;
  splitView?: boolean;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ 
  oldStr, 
  newStr, 
  splitView = true 
}) => {
  // language is not used directly but kept for API consistency
  return (
    <ReactDiffViewer
      oldValue={oldStr}
      newValue={newStr}
      splitView={splitView}
      useDarkTheme={document.documentElement.classList.contains('dark')}
      hideLineNumbers={false}
      showDiffOnly={false}
      styles={{
        variables: {
          light: {
            diffViewerBackground: 'transparent',
            addedBackground: 'rgba(0, 255, 0, 0.1)',
            addedColor: '#333',
            removedBackground: 'rgba(255, 0, 0, 0.1)',
            removedColor: '#333',
            wordAddedBackground: 'rgba(0, 255, 0, 0.2)',
            wordRemovedBackground: 'rgba(255, 0, 0, 0.2)',
            codeFoldBackground: '#f7f7f7',
            codeFoldGutterBackground: '#f7f7f7',
          },
          dark: {
            diffViewerBackground: 'transparent',
            addedBackground: 'rgba(0, 255, 0, 0.1)',
            addedColor: '#fff',
            removedBackground: 'rgba(255, 0, 0, 0.1)',
            removedColor: '#fff',
            wordAddedBackground: 'rgba(0, 255, 0, 0.2)',
            wordRemovedBackground: 'rgba(255, 0, 0, 0.2)',
            codeFoldBackground: '#2d2d2d',
            codeFoldGutterBackground: '#2d2d2d',
          }
        },
        contentText: {
          fontSize: '0.7rem',
          lineHeight: '1rem',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        },
      }}
      codeFoldMessageRenderer={() => <></>}
    />
  );
};