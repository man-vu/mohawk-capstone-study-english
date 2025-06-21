import { screen } from '@testing-library/react';
import CoursesPage from '../pages/CoursesPage';
import { renderWithProviders } from './test-utils';

describe('CoursesPage', () => {
  it('renders courses heading', () => {
    renderWithProviders(<CoursesPage />);
    expect(screen.getByText('IELTS Courses')).toBeInTheDocument();
  });
});
