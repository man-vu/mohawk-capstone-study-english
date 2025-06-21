import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameHeader from '../components/games/FlashcardMemoryGame/GameHeader';
import { renderWithProviders } from './test-utils';
import { vi } from 'vitest';

const baseProps = {
  gameMode: 'quiz',
  timer: 55,
  currentIndex: 2,
  totalCards: 5,
  score: 10,
  isPaused: false,
  onPauseToggle: vi.fn(),
  onShuffle: vi.fn(),
  onReset: vi.fn(),
  onBack: vi.fn(),
};

describe('GameHeader', () => {
  it('displays timer and card progress', () => {
    renderWithProviders(<GameHeader {...baseProps} />);
    expect(screen.getByText('quiz Mode')).toBeInTheDocument();
    expect(screen.getByText('Card: 2/5')).toBeInTheDocument();
    expect(screen.getByText('Score: 10')).toBeInTheDocument();
  });

  it('calls callbacks when clicking buttons', async () => {
    const user = userEvent.setup();
    renderWithProviders(<GameHeader {...baseProps} />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    await user.click(buttons[1]);
    await user.click(buttons[2]);
    await user.click(buttons[3]);
    expect(baseProps.onPauseToggle).toHaveBeenCalled();
    expect(baseProps.onShuffle).toHaveBeenCalled();
    expect(baseProps.onReset).toHaveBeenCalled();
    expect(baseProps.onBack).toHaveBeenCalled();
  });
});
