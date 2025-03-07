import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UploadTrajectory } from '../UploadTrajectory';

describe('UploadTrajectory', () => {
  const mockOnUpload = jest.fn();

  beforeEach(() => {
    mockOnUpload.mockClear();
  });

  it('renders upload area with instructions', () => {
    render(<UploadTrajectory onUpload={mockOnUpload} />);

    expect(screen.getByText(/drag and drop a trajectory file here/i)).toBeInTheDocument();
    expect(screen.getByText(/only .json files are supported/i)).toBeInTheDocument();
  });

  it('shows drag active state', () => {
    render(<UploadTrajectory onUpload={mockOnUpload} />);

    const dropzone = screen.getByText(/drag and drop a trajectory file here/i).parentElement!.parentElement!;

    // Simulate drag enter
    fireEvent.dragEnter(dropzone);

    expect(screen.getByText(/drop the trajectory file here/i)).toBeInTheDocument();
  });

  it('handles file upload', async () => {
    render(<UploadTrajectory onUpload={mockOnUpload} />);

    const file = new File([
      JSON.stringify([
        {
          action: 'execute_bash',
          args: { command: 'ls' }
        }
      ])
    ], 'trajectory.json', { type: 'application/json' });

    const dropzone = screen.getByText(/drag and drop a trajectory file here/i).parentElement!.parentElement!;

    // Create a fake drop event
    const dropEvent = createDropEvent([file]);

    // Trigger the drop
    fireEvent.drop(dropzone, dropEvent);

    // Wait for file to be read and processed
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockOnUpload).toHaveBeenCalledWith({
      content: {
        trajectory: [
          {
            action: 'execute_bash',
            args: { command: 'ls' }
          }
        ]
      }
    });
  });

  it('handles invalid JSON file', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<UploadTrajectory onUpload={mockOnUpload} />);

    const file = new File(['invalid json'], 'trajectory.json', { type: 'application/json' });
    const dropzone = screen.getByText(/drag and drop a trajectory file here/i).parentElement!.parentElement!;
    const dropEvent = createDropEvent([file]);

    fireEvent.drop(dropzone, dropEvent);

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockOnUpload).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Failed to parse the trajectory file. Please make sure it is a valid JSON file.');

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });
});

// Helper function to create a drop event with files
function createDropEvent(files: File[]) {
  return {
    dataTransfer: {
      files,
      items: files.map(file => ({
        kind: 'file',
        type: file.type,
        getAsFile: () => file
      })),
      types: ['Files']
    }
  };
}