import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PauseOverlay from '../components/games/word-association/PauseOverlay';
import { renderWithProviders } from './test-utils';
import { vi } from 'vitest';

describe('PauseOverlay', () => {
  it('shows overlay when paused and resumes on click', async () => {
    const user = userEvent.setup();
    const toggle = vi.fn();
    renderWithProviders(<PauseOverlay isPaused togglePause={toggle} />);
    expect(screen.getByText('Game Paused')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /resume game/i }));
    expect(toggle).toHaveBeenCalled();
  });
});
