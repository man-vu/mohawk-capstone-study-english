import { screen } from '@testing-library/react';
import Features from '../components/home/Features';
import { renderWithProviders } from './test-utils';

describe('Features', () => {
  it('lists key features', () => {
    renderWithProviders(<Features />);
    expect(screen.getByText('Why Choose IELTS Master?')).toBeInTheDocument();
    expect(screen.getByText('Authentic Practice Tests')).toBeInTheDocument();
  });
});
