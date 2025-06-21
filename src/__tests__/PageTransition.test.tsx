import { screen } from '@testing-library/react';
import PageTransition from '../components/layout/PageTransition';
import { renderWithProviders } from './test-utils';

describe('PageTransition', () => {
  it('renders its children', () => {
    renderWithProviders(
      <PageTransition>
        <div>Inner Content</div>
      </PageTransition>
    );
    expect(screen.getByText('Inner Content')).toBeInTheDocument();
  });
});
