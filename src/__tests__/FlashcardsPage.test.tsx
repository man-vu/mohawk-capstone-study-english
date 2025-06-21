import { screen } from '@testing-library/react';
import FlashcardsPage from '../pages/FlashcardsPage';
import { renderWithProviders } from './test-utils';

describe('FlashcardsPage', () => {
  it('renders flashcards heading', () => {
    renderWithProviders(<FlashcardsPage />);
    expect(screen.getByText('Flashcards')).toBeInTheDocument();
  });
});
