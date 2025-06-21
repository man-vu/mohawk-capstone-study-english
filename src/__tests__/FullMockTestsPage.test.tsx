import { screen } from '@testing-library/react';
import FullMockTestsPage from '../pages/FullMockTestsPage';
import { renderWithProviders } from './test-utils';

describe('FullMockTestsPage', () => {
  it('shows mock tests heading', () => {
    renderWithProviders(<FullMockTestsPage />);
    expect(screen.getByText('Full IELTS Mock Tests')).toBeInTheDocument();
  });
});
