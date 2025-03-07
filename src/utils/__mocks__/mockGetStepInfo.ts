import { TimelineEntry } from '../../components/timeline/types';

interface StepInfo {
  stepTitle: string;
  stepIcon: any;  // We don't care about the actual icon in tests
  actorType: 'User' | 'Assistant' | 'System';
  stepColor: 'blue' | 'green' | 'purple' | 'yellow' | 'indigo';
}

export const mockGetStepInfo = (entry: TimelineEntry): StepInfo => {
  if (entry.actorType === 'User' && entry.type === 'message') {
    return {
      stepTitle: 'User Message',
      stepIcon: {},
      actorType: 'User',
      stepColor: 'purple',
    };
  }

  if (entry.actorType === 'Assistant' && entry.type === 'message') {
    return {
      stepTitle: 'Assistant Message',
      stepIcon: {},
      actorType: 'Assistant',
      stepColor: 'blue',
    };
  }

  return {
    stepTitle: 'Action',
    stepIcon: {},
    actorType: entry.actorType || 'Assistant',
    stepColor: 'blue',
  };
};