# Action Type Compatibility Guide

This document describes how the trajectory-visualizer handles compatibility with new action types in trajectory data.

## Overview

The trajectory-visualizer is designed to be flexible and handle new action types without breaking. When a new action type is introduced, the system will:

1. Try to map it to an existing timeline entry type
2. Use context clues from the action name to determine the appropriate visualization
3. Provide a fallback rendering for completely unknown action types

## Adding New Action Types

When adding a new action type to the system, follow these steps:

### 1. Update Type Definitions

Add TypeScript interfaces for both the action and its observation in `src/types/share.ts`:

```typescript
export interface NewActionType {
  id: number;
  action: "new_action_name";
  message: string;
  source: "agent";
  timestamp: string;
  args: {
    // Action-specific args
    [key: string]: any;
  };
  tool_call_metadata?: Record<string, any>;
  llm_metrics?: Record<string, any>;
}

export interface NewActionObservation {
  id: number;
  cause: number;
  observation: "new_action_name";
  message: string;
  content: string;
  source: "agent";
  timestamp: string;
  extras: Record<string, unknown>;
  tool_call_metadata?: Record<string, any>;
  success?: boolean;
}
```

And update the `TrajectoryItem` type union.

### 2. Add Type Guards

Create type guard functions in `src/utils/share.ts`:

```typescript
export const isNewAction = (data: TrajectoryItem): data is NewActionType =>
  "action" in data && data.action === "new_action_name" && "source" in data && data.source === "agent";

export const isNewActionObservation = (data: TrajectoryItem): data is NewActionObservation =>
  "observation" in data && data.observation === "new_action_name" && "source" in data && data.source === "agent";
```

### 3. Update Timeline Entry Conversion

Add cases to the `trajectoryItemToTimelineEntry` function to map the new action to an appropriate timeline entry type:

```typescript
if (isNewAction(item)) {
  return {
    type: 'search', // Or 'command', 'edit', etc., depending on the action's nature
    timestamp: item.timestamp,
    command: `${JSON.stringify(item.args)}`,
    metadata: {
      // Include any relevant metadata
    },
    actorType: 'Assistant',
  };
}

if (isNewActionObservation(item)) {
  return {
    type: 'search', // Same type as the corresponding action
    timestamp: item.timestamp,
    content: item.content,
    metadata: {
      success: item.success,
    },
    actorType: 'System',
  };
}
```

### 4. Create Visualization Components

Create components for the new action types in `src/components/share/trajectory-list-items/`:

```tsx
// new-action.tsx
import React from 'react';
import { TrajectoryCard } from "../trajectory-card";
import { NewActionType } from '../../../types/share';

interface NewActionProps {
  action: NewActionType;
}

export const NewActionComponent: React.FC<NewActionProps> = ({ action }) => {
  return (
    <TrajectoryCard className="bg-purple-50 dark:bg-purple-900/10">
      <TrajectoryCard.Header className="bg-purple-100 dark:bg-purple-800/50">
        New Action
      </TrajectoryCard.Header>
      <TrajectoryCard.Body>
        <div className="font-medium">{action.message}</div>
        <div className="mt-2 text-sm">
          {/* Render action-specific content */}
        </div>
      </TrajectoryCard.Body>
    </TrajectoryCard>
  );
};
```

### 5. Update the JsonlViewer Component

Update the mapping in the JsonlViewer component to render the new components:

```tsx
if (isNewAction(item)) {
  return <NewActionComponent key={index} action={item} />;
} else if (isNewActionObservation(item)) {
  return <NewActionObservationComponent key={index} observation={item} />;
}
```

### 6. Update Action Type Mapping

Extend the `mapEntryTypeToTimelineType` function to handle the new action:

```typescript
export function mapEntryTypeToTimelineType(type: string): TimelineEntry['type'] {
  switch (type) {
    // Existing cases...
    case 'new_action_name':
      return 'search'; // Or appropriate type
    // Default case...
  }
}
```

## Dynamic Handling of Unknown Actions

To ensure compatibility with future action types that may not be explicitly defined, the system includes intelligent fallback mechanisms:

### 1. Smart Type Inference

If an action type isn't explicitly defined, the system will try to determine the appropriate visualization based on the action name:

```typescript
if (action.includes('read') || action.includes('search') || action.includes('query')) {
  return 'search';
}
if (action.includes('edit') || action.includes('write') || action.includes('update')) {
  return 'edit';
}
if (action.includes('run') || action.includes('execute')) {
  return 'command';
}
```

### 2. Generic Fallback Rendering

For completely unknown actions, the system will render a generic component showing all the action's data as JSON:

```tsx
<TrajectoryCard key={index}>
  <CSyntaxHighlighter language="json">
    {JSON.stringify(item, null, 2)}
  </CSyntaxHighlighter>
</TrajectoryCard>
```

## Versioning Strategy

The system uses a feature detection approach rather than strict versioning:

- Data structures use optional fields to remain compatible with older formats
- The TrajectoryHistoryEntry interface includes a catchall `[key: string]: any` to accommodate future fields
- Type guards check for the presence of specific fields rather than assuming a particular structure

This allows for graceful degradation when encountering new action types:
- Legacy viewers can still render new action types reasonably well
- New viewers can take full advantage of additional metadata
- The system remains extensible for future action types without requiring changes to the parsing logic

## Example: query_code_index Action

The `query_code_index` action demonstrates this compatibility approach:

```json
{
  "id": 72,
  "timestamp": "2025-04-29T14:34:42.495960",
  "source": "agent",
  "message": "query index method: get_code_around_line...",
  "action": "query_code_index",
  "args": {
    "method": "get_code_around_line",
    "params": {
      "file_path": "/workspace/django__django__3.0/django/core/management/commands/sqlmigrate.py",
      "line_number": 59,
      "project_path": "/workspace/django__django__3.0",
      "window_size": 20
    }
  },
  "tool_call_metadata": {
    // Metadata about the tool call
  }
}
```

This is mapped to a 'search' timeline entry type and rendered with a specialized component that clearly displays the method and params in a syntax-highlighted format.

## Best Practices

1. **Graceful Degradation**: Always ensure the system can handle unknown action types gracefully
2. **Meaningful Defaults**: Choose sensible defaults for new action types based on their nature
3. **Consistent Styling**: Follow the existing design patterns when creating new visualization components
4. **Documentation**: Document new action types thoroughly, including their fields and expected behavior
5. **Testing**: Add test cases for new action types to ensure proper rendering
