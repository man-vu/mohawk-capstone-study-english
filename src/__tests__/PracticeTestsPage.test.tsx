import { screen } from '@testing-library/react';
import PracticeTestsPage from '../pages/PracticeTestsPage';
import { renderWithProviders } from './test-utils';

describe('PracticeTestsPage', () => {
  it('renders main heading', () => {
    renderWithProviders(<PracticeTestsPage />);
    expect(screen.getByText('Practice Tests')).toBeInTheDocument();
  });
});
