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

function getActorType(source: string | undefined): 'User' | 'Assistant' | 'System' {
  if (source === 'user') return 'User';
  if (source === 'system' || source === 'environment') return 'System';
  return 'Assistant';
}

function mapEntryTypeToTimelineType(type: string): TimelineEntry['type'] {
  switch (type) {
    case 'command':
      return 'command';
    case 'edit':
      return 'edit';
    case 'search':
      return 'search';
    case 'error':
      return 'error';
    case 'message':
      return 'message';
    case 'thought':
      return 'message'; // Thoughts are displayed as messages with special styling
    default:
      console.log('Unknown entry type:', type);
      return 'message';
  }
}

interface HistoryEntry {
  id: number;
  timestamp: string;
  // Original OpenHands format
  source?: string;
  message?: string;
  action?: string;
  args?: {
    content?: string;
    path?: string;
    command?: string;
  };
  // Sample format
  type?: string;
  content?: string;
  actorType?: string;
  command?: string;
  path?: string;
}

interface HistoryFormat {
  history: HistoryEntry[];
}

export function convertOpenHandsTrajectory(trajectory: OpenHandsEvent[] | { entries: OpenHandsEvent[] } | { test_result: { git_patch: string } } | HistoryFormat): OpenHandsTimelineEntry[] {
  // Handle different formats
  let events: OpenHandsEvent[];
  
  if (Array.isArray(trajectory)) {
    events = trajectory;
  } else if ('entries' in trajectory) {
    events = trajectory.entries;
  } else if ('history' in trajectory && Array.isArray(trajectory.history)) {
    // Convert history entries to timeline format
    return (trajectory as HistoryFormat).history.map(entry => {
      // Handle the format in sample-trajectory.jsonl
      if ('type' in entry && 'content' in entry && 'actorType' in entry) {
        console.log('Processing entry with type:', entry.type);
        
        const timelineEntry: TimelineEntry = {
          type: mapEntryTypeToTimelineType(entry.type || ''),
          timestamp: entry.timestamp,
          title: entry.content ? entry.content.split('\n')[0] : '',
          content: entry.content,
          actorType: entry.actorType as 'User' | 'Assistant' | 'System',
          command: entry.command || '',
          path: entry.path || ''
        };

        console.log('Mapped to timeline type:', timelineEntry.type);

        // Handle thought type
        if (entry.type === 'thought') {
          timelineEntry.thought = entry.content;
          timelineEntry.content = undefined;
        }

        return timelineEntry;
      }
      
      // Handle the original OpenHands format
      const timelineEntry: TimelineEntry = {
        type: entry.action === 'read' ? 'search' : entry.action === 'message' ? 'message' : 'command',
        timestamp: entry.timestamp,
        title: entry.message,
        content: entry.args?.content || entry.message,
        actorType: entry.source === 'user' ? 'User' : entry.source === 'agent' ? 'Assistant' : 'System',
        command: '',
        path: entry.args?.path || ''
      };

      // Add command for execute_bash action
      if (entry.action === 'execute_bash' && entry.args?.command) {
        timelineEntry.command = entry.args.command;
      }

      // Add path for str_replace_editor action
      if (entry.action === 'str_replace_editor' && entry.args?.path) {
        timelineEntry.path = entry.args.path;
      }

      return timelineEntry;
    });
  } else if ('test_result' in trajectory && 'git_patch' in trajectory.test_result) {
    // Convert git patch to timeline entries
    const entries: TimelineEntry[] = [];

    // Add git patch entry
    entries.push({
      type: 'message',
      timestamp: new Date().toISOString(),
      title: 'Git Patch',
      content: trajectory.test_result.git_patch,
      actorType: 'System',
      command: '',
      path: ''
    } as TimelineEntry);

    // Add file changes
    const patch = trajectory.test_result.git_patch;
    const fileMatches = patch.matchAll(/^diff --git a\/(.*?) b\/(.*?)$/gm);
    for (const match of fileMatches) {
      const file = match[1];
      entries.push({
        type: 'edit',
        timestamp: new Date().toISOString(),
        title: `Changes in ${file}`,
        content: '',
        actorType: 'System',
        command: '',
        path: file
      } as TimelineEntry);
    }

    return entries;
  } else {
    throw new Error('Invalid trajectory format. Expected one of:\n1. Array of events with action, args, timestamp, etc.\n2. Object with "entries" array containing events\n3. Object with "history" array containing events\n4. Object with "test_result.git_patch" containing a git patch');
  }

  if (!Array.isArray(events)) {
    throw new Error('Invalid trajectory format. Events must be an array.');
  }
  // First entry is always a message showing the start
  const entries: OpenHandsTimelineEntry[] = [{
    type: 'message',
    timestamp: new Date().toISOString(),
    title: 'Starting trajectory visualization',
    content: 'Trajectory loaded from OpenHands format',
    actorType: 'System',
    command: '',
    path: ''
  } as TimelineEntry];

  for (const event of events) {
    // Skip environment state changes
    if (event.source === 'environment' && event.observation === 'agent_state_changed') {
      continue;
    }

    if (event.action) {
      // This is an action event
      const entry = {
        type: getActionType(event.action),
        timestamp: event.timestamp || new Date().toISOString(),
        title: event.message || event.action,
        thought: event.cause,
        metadata: {},
        actorType: getActorType(event.source),
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
        type: event.observation === 'user_message' || event.observation === 'assistant_message' ? 'message' : getObservationType(event.observation, event.success),
        timestamp: event.timestamp || new Date().toISOString(),
        title: event.message || event.observation,
        content: event.content || '',
        metadata: event.extras || {},
        actorType: getActorType(event.source),
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

function getObservationType(_observation: string, success?: boolean): TimelineEntry['type'] {
  if (success === false) {
    return 'error';
  }
  return 'message';
}