import { FC, MouseEvent } from 'react';

export interface TimelineEntry {
  type: string;
  content: string;
  timestamp: string;
  is_input?: boolean;
  action?: string;
  command?: string;
  thought?: string;
  path?: string;
  metadata?: {
    cost?: number;
    tokens?: number;
    [key: string]: any;
  };
}

interface TimelineStepProps {
  entry: TimelineEntry;
  index: number;
  isSelected: boolean;
  isLast: boolean;
  formatTimelineDate: (entry: TimelineEntry) => string;
  onSelect: (index: number) => void;
  onCommandClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onFileEditClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

declare const TimelineStep: FC<TimelineStepProps>;

export default TimelineStep; 