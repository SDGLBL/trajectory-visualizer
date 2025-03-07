import { TimelineEntry } from '../components/timeline/types';

// Re-export the TimelineEntry type to ensure we're using the same type
interface OpenHandsTimelineEntry extends TimelineEntry {}

interface OpenHandsEvent {
  id?: number;
  timestamp?: string;
  source?: string;
  message?: string;
  cause?: string;
  action?: string;
  observation?: string;
  tool_call_metadata?: {
    tool_name: string;
    tool_args: Record<string, any>;
  };
  args?: Record<string, any>;
  content?: string;
  extras?: Record<string, any>;
  success?: boolean;
}

export function convertOpenHandsTrajectory(trajectory: OpenHandsEvent[]): OpenHandsTimelineEntry[] {
  // First entry is always a message showing the start
  const entries: OpenHandsTimelineEntry[] = [{
    type: 'message',
    timestamp: new Date().toISOString(),
    title: 'Starting trajectory visualization',
    content: 'Trajectory loaded from OpenHands format'
  }];

  for (const event of trajectory) {
    if (event.action) {
      // This is an action event
      const entry = {
        type: getActionType(event.action),
        timestamp: event.timestamp || new Date().toISOString(),
        title: event.message || event.action,
        thought: event.cause,
        metadata: {},
        actorType: (event.source === 'user' ? 'User' : event.source === 'system' ? 'System' : 'Assistant') as 'User' | 'Assistant' | 'System',
        command: '',
        path: ''
      };

      // Add command for execute_bash action
      if (event.action === 'execute_bash' && event.args?.command) {
        entry.command = event.args.command;
      }

      // Add path for str_replace_editor action
      if (event.action === 'str_replace_editor' && event.args?.path) {
        entry.path = event.args.path;
      }

      // Add any tool metadata
      if (event.tool_call_metadata) {
        entry.metadata = {
          tool_name: event.tool_call_metadata.tool_name,
          ...event.tool_call_metadata.tool_args
        };
      }

      entries.push(entry as TimelineEntry);
    } else if (event.observation) {
      // This is an observation event
      const entry = {
        type: getObservationType(event.observation, event.success),
        timestamp: event.timestamp || new Date().toISOString(),
        title: event.source === 'user' ? 'User Message' : event.message || event.observation,
        content: event.content || '',
        metadata: event.extras || {},
        actorType: (event.source === 'user' ? 'User' : event.source === 'system' ? 'System' : 'Assistant') as 'User' | 'Assistant' | 'System',
        command: '',
        path: ''
      };

      entries.push(entry as TimelineEntry);
    }
  }

  return entries;
}

function getActionType(action: string): TimelineEntry['type'] {
  switch (action) {
    case 'execute_bash':
      return 'command';
    case 'str_replace_editor':
      return 'edit';
    case 'web_read':
    case 'browser':
      return 'search';
    default:
      return 'message';
  }
}

function getObservationType(observation: string, success?: boolean): TimelineEntry['type'] {
  if (success === false) {
    return 'error';
  }
  return 'message';
}