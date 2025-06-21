import { screen } from '@testing-library/react';
import AboutPage from '../pages/AboutPage';
import { renderWithProviders } from './test-utils';

describe('AboutPage', () => {
  it('renders about heading', () => {
    renderWithProviders(<AboutPage />);
    expect(screen.getByText('About IELTS Master')).toBeInTheDocument();
  });
});
