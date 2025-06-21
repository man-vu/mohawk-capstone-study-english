import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VocabularyGames from '../components/games/VocabularyGames';
import { renderWithProviders } from './test-utils';
import { vi } from 'vitest';

vi.mock('../components/games/MatchingCardsGame/index', () => ({ default: () => <div>Matching Game</div> }));
vi.mock('../components/games/WordAssociationGame', () => ({ default: () => <div>Word Association</div> }));
vi.mock('../components/games/FlashcardMemoryGame/FlashcardMemoryGame', () => ({ default: () => <div>Flashcard Game</div> }));

describe('VocabularyGames', () => {
  it('renders game list and opens a game', async () => {
    const user = userEvent.setup();
    renderWithProviders(<VocabularyGames />);
    expect(screen.getByText('Vocabulary Games')).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: /play game/i })[0]);
    expect(screen.getByText('Back to Games')).toBeInTheDocument();
  });
});
