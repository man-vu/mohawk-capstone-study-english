import { screen } from '@testing-library/react';
import FullMockTestsPage from '../pages/FullMockTestsPage';
import { renderWithProviders, mockApi } from './test-utils';

describe('FullMockTestsPage', () => {
  it('fetches mock tests and displays them', async () => {
    const restore = mockApi();
    renderWithProviders(<FullMockTestsPage />);
    expect(screen.getByText('Full IELTS Mock Tests')).toBeInTheDocument();
    expect(await screen.findByText('Mock Test')).toBeInTheDocument();
    restore();
  });
});
