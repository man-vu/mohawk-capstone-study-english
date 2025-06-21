import { screen } from '@testing-library/react';
import ListeningTestPage from '../pages/ListeningTestPage';
import { renderWithProviders } from './test-utils';

describe('ListeningTestPage', () => {
  it('renders listening instructions', () => {
    renderWithProviders(<ListeningTestPage />);
    expect(screen.getByText('IELTS Listening Test')).toBeInTheDocument();
  });
});
