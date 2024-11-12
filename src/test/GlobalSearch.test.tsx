import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import GlobalSearch from '../features/globalSearch';
import { describe, test, expect, vi } from 'vitest';

// Mock useDebounce hook
vi.mock('../../../hooks/useDebounce', () => ({
  useDebounce: (fn: (value: string) => void) => fn,
}));

function renderWithRouter(ui: React.ReactElement) {
  return render(ui, { wrapper: BrowserRouter });
}

describe('GlobalSearch Component', () => {
  test('should render search input', () => {
    renderWithRouter(<GlobalSearch />);
    expect(
      screen.getByPlaceholderText('Search for a movie...'),
    ).toBeInTheDocument();
  });

  test('should update URL with search query after typing in search input', async () => {
    const user = userEvent.setup();
    renderWithRouter(<GlobalSearch />);

    const input = screen.getByPlaceholderText('Search for a movie...');
    await user.type(input, 'avatar');

    await waitFor(() => {
      expect(window.location.search).toBe('?q=avatar');
    });
  });

  test('should navigate to home page with search query', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/watchlist');

    renderWithRouter(<GlobalSearch />);
    const input = screen.getByPlaceholderText('Search for a movie...');
    await user.type(input, 'avatar');

    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
      expect(window.location.search).toBe('?q=avatar');
    });
  });
});
