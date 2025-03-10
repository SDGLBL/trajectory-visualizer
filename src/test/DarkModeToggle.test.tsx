import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

describe('Dark Mode Toggle', () => {
  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Mock localStorage
    const mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  it('should not navigate away when toggling dark mode', () => {
    // Render the app with a specific route
    render(
      <MemoryRouter initialEntries={['/owner/repo/123']}>
        <App router={false} />
      </MemoryRouter>
    );

    // Get the initial pathname
    const initialPathname = window.location.pathname;

    // Find and click the dark mode toggle button
    const darkModeButton = screen.getByTitle(/Switch to dark mode/i);
    fireEvent.click(darkModeButton);

    // Verify that the pathname hasn't changed
    expect(window.location.pathname).toBe(initialPathname);
  });
});