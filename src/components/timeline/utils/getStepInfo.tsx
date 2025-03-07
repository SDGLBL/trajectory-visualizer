
import { TimelineEntry, StepInfo } from '../types';

function getActorType(entry: TimelineEntry): 'User' | 'Assistant' | 'System' {
  return entry.actorType || 'System';
}

export const getStepInfo = (entry: TimelineEntry): StepInfo => {
  // Return the message title for messages
  if (entry.type === 'message') {
    return {
      stepTitle: entry.title || entry.content || '',
      stepIcon: (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      actorType: getActorType(entry),
      stepColor: getActorType(entry) === 'User' ? 'purple' : 'blue'
    };
  }

  if (entry.type === 'command') {
    return {
      stepTitle: 'Command',
      stepIcon: (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      actorType: getActorType(entry),
      stepColor: 'green'
    };
  }

  if (entry.type === 'edit') {
    return {
      stepTitle: 'Edit',
      stepIcon: (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      actorType: getActorType(entry),
      stepColor: 'yellow'
    };
  }

  if (entry.type === 'search') {
    return {
      stepTitle: 'Search',
      stepIcon: (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      actorType: getActorType(entry),
      stepColor: 'indigo'
    };
  }

  if (entry.type === 'error') {
    return {
      stepTitle: 'Error',
      stepIcon: (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      actorType: getActorType(entry),
      stepColor: 'yellow'
    };
  }

  // Default case
  return {
    stepTitle: entry.title || 'Action',
    stepIcon: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    actorType: getActorType(entry),
    stepColor: 'blue'
  };
};