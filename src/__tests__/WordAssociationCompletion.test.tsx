import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompletionScreen from '../components/games/word-association/CompletionScreen';
import { renderWithProviders } from './test-utils';
import { vi } from 'vitest';

describe('WordAssociation CompletionScreen', () => {
  it('shows stats and triggers callbacks', async () => {
    const user = userEvent.setup();
    const reset = vi.fn();
    const back = vi.fn();
    renderWithProviders(
      <CompletionScreen totalRounds={5} score={100} accuracy={80} correctAnswers={4} totalTime={90} resetGame={reset} onBack={back} />
    );
    expect(screen.getByText(/Game Complete!/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /play again/i }));
    expect(reset).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /back to games/i }));
    expect(back).toHaveBeenCalled();
  });
});
