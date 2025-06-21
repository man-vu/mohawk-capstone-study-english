import { screen } from '@testing-library/react';
import PracticePage from '../pages/PracticePage';
import { renderWithProviders } from './test-utils';

describe('PracticePage', () => {
  it('renders error message when loading fails', () => {
    renderWithProviders(<PracticePage />);
    expect(screen.getByText('Unable to Load Quiz')).toBeInTheDocument();
  });
});
