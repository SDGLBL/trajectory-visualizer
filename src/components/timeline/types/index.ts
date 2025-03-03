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

export type StepColor = 'blue' | 'green' | 'purple' | 'yellow' | 'indigo';

export interface StepInfo {
  stepTitle: string;
  stepIcon: JSX.Element;
  actorType: string;
  stepColor: StepColor;
}

export interface TimelineProps {
  entries: TimelineEntry[];
  selectedIndex: number;
  runId: number;
  formatTimelineDate: (entry: TimelineEntry) => string;
  onStepSelect: (index: number) => void;
  onCommandClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFileEditClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  createdAt: string;
}

export interface TimelineStepProps {
  entry: TimelineEntry;
  index: number;
  isSelected: boolean;
  isLast: boolean;
  formatTimelineDate: (entry: TimelineEntry) => string;
  onSelect: (index: number) => void;
  onCommandClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFileEditClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
} 