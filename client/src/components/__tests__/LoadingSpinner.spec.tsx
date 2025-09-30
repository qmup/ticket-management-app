import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default size', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with small size', () => {
    render(<LoadingSpinner size="sm" />);
    const icon = screen.getByTestId('loading-spinner').querySelector('svg');
    expect(icon).toHaveClass('h-4', 'w-4');
  });

  it('renders with large size', () => {
    render(<LoadingSpinner size="lg" />);
    const icon = screen.getByTestId('loading-spinner').querySelector('svg');
    expect(icon).toHaveClass('h-8', 'w-8');
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('custom-class');
  });
});
