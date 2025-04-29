import { TimelineEntry } from '../components/timeline/types';

// Common types for trajectory data
export interface TrajectoryHistoryEntry {
  id?: number;
  timestamp?: string; // Make timestamp optional for backward compatibility
  // Original OpenHands format
  source?: string;
  message?: string;
  action?: string;
  observation?: string;
  args?: {
    content?: string;
    path?: string;
    command?: string;
    thought?: string;
    method?: string; // For query_code_index and similar actions
    params?: Record<string, any>; // For parameterized actions
    [key: string]: any; // Allow any other args for extensibility
  };
  // Sample format
  type?: string;
  content?: string;
  actorType?: string;
  command?: string;
  path?: string;
  thought?: string;
  // Additional fields
  extras?: Record<string, any>;
  tool_call_metadata?: {
    tool_name?: string;
    tool_args?: Record<string, any>;
    function_name?: string;
    tool_call_id?: string;
    model_response?: any;
    total_calls_in_response?: number;
    [key: string]: any;
  };
  // LLM metrics for advanced analytics
  llm_metrics?: {
    accumulated_cost?: number;
    accumulated_token_usage?: Record<string, any>;
    costs?: any[];
    response_latencies?: any[];
    token_usages?: any[];
    [key: string]: any;
  };
  // For backward compatibility
  cause?: string | number;
  success?: boolean;
  // Allow extension for future actions without breaking changes
  [key: string]: any;
}

export interface TrajectoryData {
  history: TrajectoryHistoryEntry[];
  [key: string]: any;
}

// Helper functions for type checking and conversion
export function getActorType(source: string | undefined): 'User' | 'Assistant' | 'System' {
  if (source === 'user') return 'User';
  if (source === 'system' || source === 'environment') return 'System';
  return 'Assistant';
}

export function mapEntryTypeToTimelineType(type: string): TimelineEntry['type'] {
  switch (type) {
    case 'command':
      return 'command';
    case 'edit':
      return 'edit';
    case 'search':
    case 'query_code_index':
      return 'search';
    case 'error':
      return 'error';
    case 'message':
      return 'message';
    case 'thought':
      return 'message'; // Thoughts are displayed as messages with special styling
    default:
      // Try to infer the type from the name for unknown actions
      if (type.includes('read') || type.includes('search') || type.includes('query')) {
        return 'search';
      }
      if (type.includes('edit') || type.includes('write') || type.includes('update')) {
        return 'edit';
      }
      if (type.includes('run') || type.includes('execute') || type.includes('command')) {
        return 'command';
      }
      if (type.includes('error') || type.includes('fail')) {
        return 'error';
      }
      // Fallback to message type for truly unknown types
      return 'message';
  }
}