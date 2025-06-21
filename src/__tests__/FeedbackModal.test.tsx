import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedbackModal from '../components/games/word-association/FeedbackModal';
import { renderWithProviders } from './test-utils';
import { vi } from 'vitest';

describe('FeedbackModal', () => {
  const round = {
    relationType: 'synonym',
    relatedWords: ['fast'],
    targetMeaning: 'quick',
    synonyms: ['fast'],
    antonyms: [],
    guidewords: []
  } as any;

  it('renders feedback message and calls close on overlay', async () => {
    const user = userEvent.setup();
    const close = vi.fn();
    renderWithProviders(
      <FeedbackModal feedback="Perfect" currentRound={round} selectedWords={['fast']} closeFeedback={close} />
    );
    expect(screen.getByText('Perfect')).toBeInTheDocument();
    await user.click(screen.getByText('Perfect'));
    expect(close).not.toHaveBeenCalled();
    const overlay = screen
      .getByText('Perfect')
      .parentElement!.parentElement!.parentElement!;
    await user.click(overlay);
    expect(close).toHaveBeenCalled();
  });
});
