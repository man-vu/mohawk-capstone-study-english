import { screen } from '@testing-library/react';
import StudyPlansPage from '../pages/StudyPlansPage';
import { renderWithProviders } from './test-utils';

describe('StudyPlansPage', () => {
  it('renders study plans heading', () => {
    renderWithProviders(<StudyPlansPage />);
    expect(screen.getByText('IELTS Study Plans')).toBeInTheDocument();
  });
});
