import { screen } from '@testing-library/react';
import WritingTestPage from '../pages/WritingTestPage';
import { renderWithProviders } from './test-utils';

describe('WritingTestPage', () => {
  it('renders writing test heading', () => {
    renderWithProviders(<WritingTestPage />);
    expect(screen.getByText('IELTS Writing Test')).toBeInTheDocument();
  });
});
