import { screen } from '@testing-library/react';
import Statistics from '../components/home/Statistics';
import { renderWithProviders } from './test-utils';

describe('Statistics', () => {
  it('displays key stats', () => {
    renderWithProviders(<Statistics />);
    expect(screen.getByText('Students Worldwide')).toBeInTheDocument();
    expect(screen.getByText('50,000+')).toBeInTheDocument();
  });
});
