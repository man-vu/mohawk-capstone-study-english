import { screen } from '@testing-library/react';
import HomePage from '../pages/HomePage';
import { renderWithProviders } from './test-utils';

describe('HomePage', () => {
  it('renders all home sections', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText('Master IELTS with')).toBeInTheDocument();
    expect(screen.getByText('Why Choose IELTS Master?')).toBeInTheDocument();
    expect(screen.getByText('Vocabulary Games')).toBeInTheDocument();
  });
});
