import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MultipleChoiceQuestion from '../components/quiz/MultipleChoiceQuestion';
import { renderWithProviders } from './test-utils';
import { vi } from 'vitest';

describe('MultipleChoiceQuestion', () => {
  const question = {
    question_id: 1,
    question: 'Select the correct option',
    content: [
      { choice_id: 1, choice_text: 'A' },
      { choice_id: 2, choice_text: 'B' }
    ]
  } as any;

  it('calls onAnswer when selecting a choice', async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    renderWithProviders(
      <MultipleChoiceQuestion question={question} onAnswer={onAnswer} />
    );
    await user.click(screen.getByLabelText('B'));
    expect(onAnswer).toHaveBeenCalledWith(2);
  });
});
