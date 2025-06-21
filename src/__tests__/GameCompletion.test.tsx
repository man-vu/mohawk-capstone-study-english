import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameCompletion from '../components/games/FlashcardMemoryGame/GameCompletion';
import { renderWithProviders } from './test-utils';
import { vi } from 'vitest';

const sampleCard = {
  id: '1',
  word: 'hello',
  definition: 'hi',
  example: 'hello world',
  difficulty: 'easy',
  category: 'greet',
  memorized: false,
  attempts: 0,
  correctStreak: 0,
};

const baseProps = {
  score: 20,
  accuracy: 80,
  memorizedCount: 5,
  time: '1m',
  correctWords: [sampleCard],
  incorrectWords: [],
  missedWords: [],
  onPlayAgain: vi.fn(),
  onBack: vi.fn(),
};

describe('GameCompletion', () => {
  it('renders stats and handles play again', async () => {
    const user = userEvent.setup();
    renderWithProviders(<GameCompletion {...baseProps} />);
    expect(screen.getByText('Session Complete! ⚡')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Play Again' }));
    expect(baseProps.onPlayAgain).toHaveBeenCalled();
  });
});
