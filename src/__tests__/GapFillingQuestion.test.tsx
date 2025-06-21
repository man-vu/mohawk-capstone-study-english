import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GapFillingQuestion from '../components/quiz/GapFillingQuestion';
import { renderWithProviders } from './test-utils';
import { vi } from 'vitest';

describe('GapFillingQuestion', () => {
  const question = {
    question_id: 1,
    question: 'Fill the gaps',
    content: [{ sequence_id: 1 }, { sequence_id: 2 }]
  } as any;

  it('calls onAnswer when typing', async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    renderWithProviders(
      <GapFillingQuestion question={question} answers={{}} onAnswer={onAnswer} />
    );
    const input = screen.getByPlaceholderText('Blank 1');
    await user.type(input, 'a');
    expect(onAnswer).toHaveBeenLastCalledWith(1, 'a');
  });
});
