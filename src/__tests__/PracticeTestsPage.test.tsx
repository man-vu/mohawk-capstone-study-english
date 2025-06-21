import { screen } from '@testing-library/react';
import PracticeTestsPage from '../pages/PracticeTestsPage';
import { renderWithProviders, mockApi } from './test-utils';

describe('PracticeTestsPage', () => {
  it('loads quizzes from API', async () => {
    const restore = mockApi();
    renderWithProviders(<PracticeTestsPage />);
    expect(screen.getByText('Practice Tests')).toBeInTheDocument();
    expect(await screen.findByText('Mock Quiz')).toBeInTheDocument();
    restore();
  });
});
