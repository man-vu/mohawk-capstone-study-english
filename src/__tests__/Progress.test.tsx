import { screen } from '@testing-library/react';
import { Progress } from '../components/ui/progress';
import { renderWithProviders } from './test-utils';

describe('Progress', () => {
  it('renders progress bar', () => {
    renderWithProviders(<Progress value={40} data-testid="progress" />);
    const bar = screen.getByTestId('progress').firstChild as HTMLElement;
    expect(bar).toBeInTheDocument();
  });
});
