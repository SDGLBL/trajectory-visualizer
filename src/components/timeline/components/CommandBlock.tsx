import React, { memo } from 'react';

interface CommandBlockProps {
  command: string;
  onCopy?: (command: string) => void;
}

export const CommandBlock: React.FC<CommandBlockProps> = memo(({ command, onCopy }) => (
  <div className="group relative">
    <pre className="text-[11px] font-mono text-green-500 bg-[#1E1E1E] dark:text-green-400 rounded overflow-x-auto leading-relaxed px-3 py-2">
      <span className="select-none text-gray-500 dark:text-gray-600 mr-2">$</span>{command}
    </pre>
    <button
      type="button"
      onClick={() => onCopy?.(command)}
      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-800/50 text-gray-400"
    >
      <span className="sr-only">Copy command</span>
      📋
    </button>
  </div>
));

CommandBlock.displayName = 'CommandBlock';

export default CommandBlock; 