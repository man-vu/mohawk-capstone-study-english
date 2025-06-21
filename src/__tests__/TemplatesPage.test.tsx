import { screen } from '@testing-library/react';
import TemplatesPage from '../pages/TemplatesPage';
import { renderWithProviders } from './test-utils';

describe('TemplatesPage', () => {
  it('renders practice quiz heading', () => {
    renderWithProviders(<TemplatesPage />);
    expect(screen.getByText('IELTS Practice Quiz')).toBeInTheDocument();
  });
});
