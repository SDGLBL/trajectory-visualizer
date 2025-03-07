import { convertOpenHandsTrajectory } from '../openhands-converter';

describe('OpenHands Trajectory Converter', () => {
  const timestamp = '2025-03-07T10:05:27Z';

  const sampleTrajectory = [
    {
      id: 1,
      timestamp,
      source: 'user',
      message: 'Starting task',
      cause: 'User request',
      action: 'execute_bash',
      args: {
        command: 'ls -la'
      },
      tool_call_metadata: {
        tool_name: 'execute_bash',
        tool_args: {
          command: 'ls -la'
        }
      }
    },
    {
      id: 2,
      timestamp,
      source: 'system',
      message: 'Command output',
      observation: 'command_output',
      content: 'total 12\ndrwxr-xr-x 2 user user 4096 Mar  7 10:05 .',
      extras: {
        exit_code: 0
      },
      success: true
    },
    {
      id: 3,
      timestamp,
      source: 'user',
      message: 'Editing file',
      cause: 'Need to modify code',
      action: 'str_replace_editor',
      args: {
        path: '/path/to/file.txt',
        command: 'str_replace',
        old_str: 'old content',
        new_str: 'new content'
      }
    },
    {
      id: 4,
      timestamp,
      source: 'system',
      message: 'File edited',
      observation: 'file_edited',
      content: 'File edited successfully',
      success: true
    },
    {
      id: 5,
      timestamp,
      source: 'user',
      message: 'Searching web',
      cause: 'Need information',
      action: 'web_read',
      args: {
        url: 'https://example.com'
      }
    },
    {
      id: 6,
      timestamp,
      source: 'system',
      message: 'Web content',
      observation: 'web_content',
      content: 'Example Domain',
      success: true
    },
    {
      id: 7,
      timestamp,
      source: 'system',
      message: 'Error occurred',
      observation: 'error',
      content: 'Command failed',
      success: false
    }
  ];

  it('should convert OpenHands trajectory to timeline entries', () => {
    const entries = convertOpenHandsTrajectory(sampleTrajectory);

    // First entry is always a message showing the start
    expect(entries[0]).toMatchObject({
      type: 'message',
      title: 'Starting trajectory visualization',
      content: 'Trajectory loaded from OpenHands format'
    });

    // Command entry
    expect(entries[1]).toMatchObject({
      type: 'command',
      timestamp,
      title: 'Starting task',
      thought: 'User request',
      command: 'ls -la',
      metadata: {
        tool_name: 'execute_bash',
        command: 'ls -la'
      }
    });

    // Command output
    expect(entries[2]).toMatchObject({
      type: 'message',
      timestamp,
      title: 'Command output',
      content: 'total 12\ndrwxr-xr-x 2 user user 4096 Mar  7 10:05 .',
      metadata: {
        exit_code: 0
      }
    });

    // File edit
    expect(entries[3]).toMatchObject({
      type: 'edit',
      timestamp,
      title: 'Editing file',
      thought: 'Need to modify code',
      path: '/path/to/file.txt'
    });

    // File edit result
    expect(entries[4]).toMatchObject({
      type: 'message',
      timestamp,
      title: 'File edited',
      content: 'File edited successfully'
    });

    // Web search
    expect(entries[5]).toMatchObject({
      type: 'search',
      timestamp,
      title: 'Searching web',
      thought: 'Need information'
    });

    // Web content
    expect(entries[6]).toMatchObject({
      type: 'message',
      timestamp,
      title: 'Web content',
      content: 'Example Domain'
    });

    // Error
    expect(entries[7]).toMatchObject({
      type: 'error',
      timestamp,
      title: 'Error occurred',
      content: 'Command failed'
    });
  });

  it('should handle empty trajectory', () => {
    const entries = convertOpenHandsTrajectory([]);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      type: 'message',
      title: 'Starting trajectory visualization'
    });
  });

  it('should correctly identify user and assistant messages', () => {
    const trajectory = [
      {
        id: 1,
        timestamp: '2025-03-07T13:22:20.840987',
        source: 'user',
        message: 'Please read the README',
        observation: 'user_message',
        content: 'Please read the README'
      },
      {
        id: 2,
        timestamp: '2025-03-07T13:22:21.123456',
        source: 'assistant',
        message: 'I will help you with that',
        action: 'execute_bash',
        args: {
          command: 'cat README.md'
        }
      },
      {
        id: 3,
        timestamp: '2025-03-07T13:22:21.234567',
        source: 'system',
        message: 'Command output',
        observation: 'command_output',
        content: '# Example\nThis is a readme'
      }
    ];

    const entries = convertOpenHandsTrajectory(trajectory);

    // First entry is always the start message
    expect(entries[0].type).toBe('message');
    expect(entries[0].title).toBe('Starting trajectory visualization');

    // User message
    expect(entries[1]).toMatchObject({
      type: 'message',
      title: 'User Message',
      content: 'Please read the README',
      actorType: 'User'
    });

    // Assistant action
    expect(entries[2]).toMatchObject({
      type: 'command',
      title: 'I will help you with that',
      command: 'cat README.md',
      actorType: 'Assistant'
    });

    // System output
    expect(entries[3]).toMatchObject({
      type: 'message',
      title: 'Command output',
      content: '# Example\nThis is a readme',
      actorType: 'System'
    });
  });

  it('should handle missing optional fields', () => {
    const minimalTrajectory = [
      {
        action: 'execute_bash',
        args: { command: 'ls' }
      },
      {
        observation: 'command_output',
        content: 'file.txt'
      }
    ];

    const entries = convertOpenHandsTrajectory(minimalTrajectory);
    expect(entries).toHaveLength(3); // Start message + 2 entries

    expect(entries[1]).toMatchObject({
      type: 'command',
      command: 'ls'
    });

    expect(entries[2]).toMatchObject({
      type: 'message',
      content: 'file.txt'
    });
  });
});