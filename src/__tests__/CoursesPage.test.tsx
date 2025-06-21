import { screen } from '@testing-library/react';
import CoursesPage from '../pages/CoursesPage';
import { renderWithProviders, mockApi } from './test-utils';

describe('CoursesPage', () => {
  it('loads and displays courses', async () => {
    const restore = mockApi();
    renderWithProviders(<CoursesPage />);
    expect(screen.getByText('IELTS Courses')).toBeInTheDocument();
    expect(await screen.findByText('Sample Course')).toBeInTheDocument();
    restore();
  });
});
