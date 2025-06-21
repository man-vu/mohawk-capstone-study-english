import { screen } from '@testing-library/react';
import Testimonials from '../components/home/Testimonials';
import { renderWithProviders } from './test-utils';

describe('Testimonials', () => {
  it('shows student testimonials', () => {
    renderWithProviders(<Testimonials />);
    expect(screen.getByText('What Our Students Say')).toBeInTheDocument();
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
  });
});
