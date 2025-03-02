export interface TimelineEntry {
  type: 'command' | 'edit' | 'search' | 'error' | 'message';
  timestamp: string;
  title?: string;
  content?: string;
  thought?: string;
  command?: string;
  path?: string;
  metadata?: {
    cost?: number;
    [key: string]: any;
  };
}

export type StepColor = 'blue' | 'green' | 'yellow' | 'red' | 'gray';

export interface TimelineStepProps {
  entry: TimelineEntry;
  index: number;
  isSelected: boolean;
  isLast: boolean;
  formatTimelineDate: (entry: TimelineEntry) => string;
  onSelect: (index: number) => void;
  onCommandClick?: (command: string) => void;
  onFileEditClick?: () => void;
}

export interface TimelineProps {
  entries: TimelineEntry[];
  selectedIndex: number;
  onStepSelect: (index: number) => void;
  onCommandClick?: (command: string) => void;
  onFileEditClick?: () => void;
  formatTimelineDate: (entry: TimelineEntry) => string;
  createdAt: string;
} 