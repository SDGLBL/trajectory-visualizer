import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
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

    act(() => {
      fireEvent.dragEnter(dropzone);
    });

    expect(screen.getByText(/drag and drop a trajectory file here/i)).toBeInTheDocument();
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
    const dropEvent = createDropEvent([file]);

    await act(async () => {
      fireEvent.drop(dropzone, dropEvent);
    });

    await waitFor(() => {
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
  });

  it('handles invalid JSON file', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<UploadTrajectory onUpload={mockOnUpload} />);

    const file = new File(['invalid json'], 'trajectory.json', { type: 'application/json' });
    const dropzone = screen.getByText(/drag and drop a trajectory file here/i).parentElement!.parentElement!;
    const dropEvent = createDropEvent([file]);

    await act(async () => {
      fireEvent.drop(dropzone, dropEvent);
    });

    await waitFor(() => {
      expect(mockOnUpload).not.toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('Failed to parse the trajectory file. Please make sure it is a valid JSON file.');
    });

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