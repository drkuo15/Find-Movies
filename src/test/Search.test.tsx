import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from '../components/search';
import { describe, test, expect, vi } from 'vitest';

describe('Search Component', () => {
  const mockOnChange = vi.fn();
  const defaultProps = {
    placeholder: 'Search for a movie...',
    value: '',
    onChange: mockOnChange,
  };

  test('should render placeholder text', () => {
    render(<Search {...defaultProps} />);
    expect(
      screen.getByPlaceholderText('Search for a movie...'),
    ).toBeInTheDocument();
  });

  test('should render search icon', () => {
    render(<Search {...defaultProps} />);
    expect(screen.getByAltText('searchIcon')).toBeInTheDocument();
  });

  test('should handle user input', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Search {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search for a movie...');
    await user.type(input, 'avatar');

    const newProps = { ...defaultProps, value: 'avatar' };
    rerender(<Search {...newProps} />);

    expect(mockOnChange).toHaveBeenCalled();
    expect(input).toHaveValue('avatar');
  });
});
