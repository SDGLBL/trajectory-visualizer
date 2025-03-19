// Configuration for the JSONL viewer

export interface SortField {
  value: string;
  label: string;
}

// Common sort fields with descriptions
export const COMMON_SORT_FIELDS: SortField[] = [
  { value: 'instance_id', label: 'Instance ID' },
  { value: 'metrics.accumulated_cost', label: 'Cost (metrics.accumulated_cost)' },
  { value: 'test_result.report.resolved', label: 'Resolved Status (test_result.report.resolved)' },
  { value: 'len(history)', label: 'History Length (len(history))' }
];

// Common display fields
export const COMMON_DISPLAY_FIELDS: string[] = [
  'metrics.accumulated_cost',
  'test_result.report.resolved',
  'len(history)'
];

// Default settings
export const DEFAULT_JSONL_VIEWER_SETTINGS = {
  sortField: 'instance_id',
  sortDirection: 'asc' as const,
  displayFields: [...COMMON_DISPLAY_FIELDS]
};