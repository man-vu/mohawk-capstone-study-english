import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameSetup from '../components/games/FlashcardMemoryGame/GameSetup';
import { renderWithProviders } from './test-utils';
import { vi } from 'vitest';

const baseProps = {
  lexiconType: 'vocabulary',
  setLexiconType: vi.fn(),
  gameMode: 'study',
  setGameMode: vi.fn(),
  selectedDifficulty: 'easy',
  setSelectedDifficulty: vi.fn(),
  onStart: vi.fn(),
  onBack: vi.fn(),
};

describe('GameSetup', () => {
  it('calls setter when selecting word type', async () => {
    const user = userEvent.setup();
    renderWithProviders(<GameSetup {...baseProps} />);
    await user.click(screen.getByRole('button', { name: 'Idioms' }));
    expect(baseProps.setLexiconType).toHaveBeenCalledWith('idiom');
  });

  it('starts game on start button click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<GameSetup {...baseProps} />);
    await user.click(screen.getByRole('button', { name: 'Start Flashcard Game' }));
    expect(baseProps.onStart).toHaveBeenCalled();
  });
});
