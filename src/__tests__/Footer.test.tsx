import { screen } from '@testing-library/react';
import Footer from '../components/layout/Footer';
import { renderWithProviders } from './test-utils';

describe('Footer', () => {
  it('renders footer content', () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText('IELTS Master')).toBeInTheDocument();
    expect(screen.getByText(/© 2024 IELTS Master/)).toBeInTheDocument();
  });
});
