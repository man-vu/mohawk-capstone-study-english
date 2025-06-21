import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SetupScreen from '../components/games/word-association/SetupScreen';
import { renderWithProviders } from './test-utils';
import { vi } from 'vitest';

describe('SetupScreen', () => {
  it('renders mode buttons and calls setMode', async () => {
    const user = userEvent.setup();
    const setMode = vi.fn();
    renderWithProviders(
      <SetupScreen mode="vocabulary" setMode={setMode} startGame={() => {}} noWordsAvailable={false} onBack={() => {}} />
    );
    await user.click(screen.getByText('Idioms'));
    expect(setMode).toHaveBeenCalledWith('idiom');
  });

  it('calls startGame when selecting a level', async () => {
    const user = userEvent.setup();
    const startGame = vi.fn();
    renderWithProviders(
      <SetupScreen mode="vocabulary" setMode={() => {}} startGame={startGame} noWordsAvailable={false} onBack={() => {}} />
    );
    await user.click(screen.getByText(/easy/i));
    expect(startGame).toHaveBeenCalled();
  });
});
