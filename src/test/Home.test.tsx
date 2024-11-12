import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';
import * as swr from 'swr/infinite';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Home from '../pages/home';
import { MovieListResponse } from '../types/movie';
import { act } from '@testing-library/react';

// Mock SWR Infinite
vi.mock('swr/infinite', () => ({
  default: vi.fn(),
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));
window.IntersectionObserver = mockIntersectionObserver;

function renderWithProviders(ui: React.ReactElement) {
  // creates a new cache instance for each test, preventing cache pollution
  return render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <BrowserRouter>{ui}</BrowserRouter>
    </SWRConfig>,
  );
}

// Mock SWR response
function mockSWRResponse({
  data = undefined,
  error = undefined,
  isLoading = false,
  isValidating = false,
}: {
  data?: MovieListResponse[] | undefined;
  error?: Error | undefined;
  isLoading?: boolean;
  isValidating?: boolean;
} = {}) {
  vi.mocked(swr.default).mockReturnValue({
    data,
    error,
    isLoading,
    size: 1,
    setSize: vi.fn(),
    isValidating,
    mutate: vi.fn(),
  });
}

// Helper function to create mock movies
function createMockMovies(page: number) {
  return {
    results: [
      {
        id: page + 1,
        title: `Test Movie ${page}`,
        overview: `This is test movie ${page} description`,
        release_date: '2024-01-01',
        poster_path: '/test.jpg',
      },
      {
        id: page + 2,
        title: `Another Movie ${page}`,
        overview: `This is another test movie ${page} description`,
        release_date: '2024-01-02',
        poster_path: '/test2.jpg',
      },
    ],
    total_results: 4,
    total_pages: 2,
    page,
  };
}

describe('Home Page', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    test('should render welcome message when no search query', () => {
      mockSWRResponse({ isLoading: false });
      renderWithProviders(<Home />);

      expect(
        screen.getByText('Welcome! Discover Your Next Favorite Movie!'),
      ).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    test('should render loading state when fetching movies', () => {
      window.history.pushState({}, '', '?q=test');
      mockSWRResponse({ isLoading: true });

      renderWithProviders(<Home />);

      expect(screen.getByText('Loading movies...')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    test('should render error message when fetcher fails', async () => {
      window.history.pushState({}, '', '?q=test');
      mockSWRResponse({ error: new Error('Failed to fetch') });

      renderWithProviders(<Home />);

      const errorMessage = await screen.findByText(
        'Error loading movies. Please try again.',
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('Success State', () => {
    test('should render movies when search is successful', () => {
      window.history.pushState({}, '', '?q=test');

      const mockMovies = {
        results: [
          {
            id: 1,
            title: 'Test Movie',
            overview: 'This is a test movie description',
            release_date: '2024-01-01',
            poster_path: '/test.jpg',
          },
        ],
        total_results: 1,
        total_pages: 1,
        page: 1,
      };

      mockSWRResponse({ data: [mockMovies] });

      renderWithProviders(<Home />);

      expect(screen.getByText('Test Movie')).toBeInTheDocument();
      expect(screen.getByText('2024-01-01')).toBeInTheDocument();
    });

    test('should show no results message when search returns empty', () => {
      window.history.pushState({}, '', '?q=not-found');

      mockSWRResponse({
        data: [{ results: [], total_results: 0, total_pages: 0, page: 0 }],
      });

      renderWithProviders(<Home />);

      expect(
        screen.getByText('No movies found for "not-found"'),
      ).toBeInTheDocument();
    });
  });

  describe('Infinite Scroll', () => {
    beforeEach(() => {
      window.history.pushState({}, '', '?q=test');
    });

    test('should load more movies when scrolling to bottom', async () => {
      const mockSetSize = vi.fn();
      vi.mocked(swr.default).mockReturnValue({
        data: [createMockMovies(1)],
        error: undefined,
        isLoading: false,
        size: 1,
        setSize: mockSetSize,
        isValidating: false,
        mutate: vi.fn(),
      });

      renderWithProviders(<Home />);

      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
      expect(screen.getByText('Another Movie 1')).toBeInTheDocument();

      // Simulate intersection observer callback
      const [intersectionCallback] = mockIntersectionObserver.mock.calls[0];
      act(() => {
        intersectionCallback([{ isIntersecting: true }]);
      });

      expect(mockSetSize).toHaveBeenCalled();
    });

    test('should show loading more indicator when fetching next page', () => {
      vi.mocked(swr.default).mockReturnValue({
        data: [createMockMovies(1)],
        error: undefined,
        isLoading: false,
        size: 2, // requesting page 2
        setSize: vi.fn(),
        isValidating: true, // fetching page 2
        mutate: vi.fn(),
      });

      renderWithProviders(<Home />);

      expect(screen.getByText('Loading more...')).toBeInTheDocument();
    });

    test('should stop infinite scroll when reaching the last page', () => {
      const mockSetSize = vi.fn();
      vi.mocked(swr.default).mockReturnValue({
        data: [createMockMovies(1), createMockMovies(2)],
        error: undefined,
        isLoading: false,
        size: 2,
        setSize: mockSetSize,
        isValidating: false, // All pages loaded
        mutate: vi.fn(),
      });

      renderWithProviders(<Home />);

      const [intersectionCallback] = mockIntersectionObserver.mock.calls[0];
      act(() => {
        intersectionCallback([{ isIntersecting: true }]);
      });

      expect(mockSetSize).not.toHaveBeenCalled();

      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
      expect(screen.getByText('Another Movie 1')).toBeInTheDocument();
      expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
      expect(screen.getByText('Another Movie 2')).toBeInTheDocument();
    });
  });
});
